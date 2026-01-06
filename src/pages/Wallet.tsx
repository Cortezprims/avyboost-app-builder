import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useWallet } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { Timestamp } from "firebase/firestore";
import { supabase } from "@/integrations/supabase/client";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  Loader2,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

const paymentMethods = [
  { id: "mtn", name: "MTN MoMo", icon: "🟡", color: "border-yellow-500/50 bg-yellow-500/5" },
  { id: "orange", name: "Orange Money", icon: "🟠", color: "border-orange-500/50 bg-orange-500/5" },
];

const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

export default function Wallet() {
  const { user, loading: authLoading } = useAuth();
  const { balance, transactions, loading: walletLoading, recharge, refreshBalance } = useWallet();
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeTab, setActiveTab] = useState("recharge");
  const [isRecharging, setIsRecharging] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'checking' | 'success'>('idle');
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const paymentAmountRef = useRef<number>(0);
  const paymentMethodRef = useRef<string>('');

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  const checkPaymentStatus = async (reference: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('campay-payment', {
        body: { action: 'status', reference }
      });

      console.log('Payment status check:', data);

      if (error) {
        console.error('Status check error:', error);
        return;
      }

      if (data?.data?.status === 'SUCCESSFUL') {
        // Payment successful - credit the wallet
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
          statusCheckInterval.current = null;
        }
        
        // Use refs to get the correct values
        const amount = paymentAmountRef.current;
        const methodName = paymentMethodRef.current;
        
        try {
          await recharge(amount, methodName || 'Mobile Money');
          
          // Refresh balance to ensure UI is updated
          await refreshBalance();
          
          // Update UI to show success
          setPaymentStatus('success');
          
          toast.success(`Recharge de ${amount.toLocaleString()} XAF effectuée !`);
        } catch (rechargeError) {
          console.error('Error recharging wallet:', rechargeError);
          toast.error("Le paiement est réussi mais il y a eu un problème pour mettre à jour le solde. Contactez le support.");
        }
        
        // Reset form after a short delay to show success state
        setTimeout(() => {
          setPaymentStatus('idle');
          setPaymentReference(null);
          setRechargeAmount("");
          setSelectedMethod(null);
          setPhoneNumber("");
          setIsRecharging(false);
        }, 2000);
        
      } else if (data?.data?.status === 'FAILED') {
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
          statusCheckInterval.current = null;
        }
        setPaymentStatus('idle');
        setPaymentReference(null);
        setIsRecharging(false);
        toast.error("Le paiement a échoué. Veuillez réessayer.");
      }
      // If still PENDING, continue checking
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleRecharge = async () => {
    const amount = parseInt(rechargeAmount);
    if (!amount || amount < 500) {
      toast.error("Montant minimum : 500 XAF");
      return;
    }
    if (!selectedMethod) {
      toast.error("Sélectionnez un mode de paiement");
      return;
    }
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error("Entrez un numéro de téléphone valide");
      return;
    }

    setIsRecharging(true);
    setPaymentStatus('pending');
    
    // Store values in refs to avoid stale closures
    paymentAmountRef.current = amount;
    const methodName = paymentMethods.find(m => m.id === selectedMethod)?.name || selectedMethod || '';
    paymentMethodRef.current = methodName;

    try {
      const { data, error } = await supabase.functions.invoke('campay-payment', {
        body: {
          action: 'collect',
          phone: phoneNumber,
          amount: amount,
          description: `Recharge AVYboost - ${user?.email || 'User'}`,
          external_reference: `avyboost_${user?.uid}_${Date.now()}`
        }
      });

      console.log('Campay collect response:', data);

      if (error) {
        throw new Error(error.message || 'Erreur de paiement');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.data?.reference) {
        const reference = data.data.reference;
        setPaymentReference(reference);
        setPaymentStatus('checking');
        
        toast.info("Confirmez le paiement sur votre téléphone", {
          description: data.data.ussd_code ? `Composez ${data.data.ussd_code}` : undefined,
          duration: 10000
        });

        // Start checking payment status every 5 seconds
        statusCheckInterval.current = setInterval(() => {
          checkPaymentStatus(reference);
        }, 5000);

        // Stop checking after 3 minutes
        const timeoutId = setTimeout(() => {
          if (statusCheckInterval.current) {
            clearInterval(statusCheckInterval.current);
            statusCheckInterval.current = null;
            setPaymentStatus('idle');
            setIsRecharging(false);
            toast.error("Délai expiré. Vérifiez votre historique.");
          }
        }, 180000);
        
        // Clear timeout if payment completes before 3 minutes
        return () => clearTimeout(timeoutId);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du paiement";
      toast.error(errorMessage);
      setPaymentStatus('idle');
      setIsRecharging(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Aujourd'hui, ${time}`;
    if (isYesterday) return `Hier, ${time}`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + `, ${time}`;
  };

  // Calculate monthly stats
  const thisMonth = new Date().getMonth();
  const monthlyCredits = transactions
    .filter(tx => tx.type === 'credit' && tx.createdAt?.toDate?.()?.getMonth() === thisMonth)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyDebits = transactions
    .filter(tx => tx.type === 'debit' && tx.createdAt?.toDate?.()?.getMonth() === thisMonth)
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <WalletIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium mb-2">Connexion requise</p>
        <p className="text-muted-foreground text-center mb-4">
          Connectez-vous pour accéder à votre portefeuille
        </p>
        <Button asChild className="gradient-primary">
          <Link to="/auth">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="font-display font-bold text-lg">Portefeuille</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="gradient-primary p-5 text-primary-foreground">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <WalletIcon className="w-5 h-5" />
                <span className="text-sm text-white/80">Solde disponible</span>
              </div>
              <Badge className="bg-white/20 text-white">XAF</Badge>
            </div>
            {walletLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <p className="text-4xl font-bold">
                {balance.toLocaleString()} <span className="text-lg font-normal">FCFA</span>
              </p>
            )}
          </div>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="w-3 h-3" />
              Minimum de recharge : 500 XAF
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-lg font-bold text-green-500">+{monthlyCredits.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Recharges ce mois</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <ArrowUpRight className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold">-{monthlyDebits.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Dépenses ce mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recharge">
              <Plus className="w-4 h-4 mr-2" />
              Recharger
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="w-4 h-4 mr-2" />
              Historique
            </TabsTrigger>
          </TabsList>

          {/* Recharge Tab */}
          <TabsContent value="recharge" className="space-y-4 mt-4">
            {/* Quick Amounts */}
            <div>
              <p className="text-sm font-medium mb-3">Montant rapide</p>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={rechargeAmount === amount.toString() ? "default" : "outline"}
                    size="sm"
                    className={rechargeAmount === amount.toString() ? "gradient-primary" : ""}
                    onClick={() => setRechargeAmount(amount.toString())}
                  >
                    {amount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <Input
                type="number"
                placeholder="Montant personnalisé"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="pr-12"
                min={500}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                XAF
              </span>
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-sm font-medium mb-3">Mode de paiement</p>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={isRecharging}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${method.color} ${
                      selectedMethod === method.id
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    } ${isRecharging ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-sm font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <p className="text-sm font-medium mb-3">Numéro de téléphone</p>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="pl-10"
                  maxLength={9}
                  disabled={isRecharging}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Numéro {selectedMethod === 'mtn' ? 'MTN' : selectedMethod === 'orange' ? 'Orange' : 'Mobile Money'}
              </p>
            </div>

            {/* Payment Status */}
            {paymentStatus !== 'idle' && (
              <Card className={`border ${
                paymentStatus === 'success' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-primary/5 border-primary/20'
              }`}>
                <CardContent className="p-4 flex items-center gap-3">
                  {paymentStatus === 'success' ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-sm">
                      {paymentStatus === 'pending' && 'Initiation du paiement...'}
                      {paymentStatus === 'checking' && 'En attente de confirmation...'}
                      {paymentStatus === 'success' && 'Paiement réussi !'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {paymentStatus === 'success' 
                        ? 'Votre solde a été mis à jour' 
                        : 'Confirmez le paiement sur votre téléphone'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirm Button */}
            <Button
              size="lg"
              className="w-full gradient-primary glow"
              onClick={handleRecharge}
              disabled={!rechargeAmount || !selectedMethod || !phoneNumber || phoneNumber.length < 9 || isRecharging}
            >
              {isRecharging ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {isRecharging ? 'Paiement en cours...' : `Recharger ${rechargeAmount ? `${parseInt(rechargeAmount).toLocaleString()} XAF` : ""}`}
            </Button>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-4">
            {walletLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium mb-2">Aucune transaction</p>
                  <p className="text-sm text-muted-foreground">
                    Vos transactions apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "credit" ? "bg-green-500/10" : "bg-red-500/10"
                      }`}>
                        {tx.type === "credit" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-500" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {tx.type === "credit" ? tx.method : tx.service}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        tx.type === "credit" ? "text-green-500" : "text-foreground"
                      }`}>
                        {tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString()}
                      </p>
                      {tx.status === "pending" && (
                        <Badge variant="secondary" className="text-[10px]">En attente</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
