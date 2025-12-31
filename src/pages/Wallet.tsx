import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  Smartphone,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const paymentMethods = [
  {
    id: "orange",
    name: "Orange Money",
    icon: "🟠",
    color: "bg-orange-500/10 border-orange-500/30 hover:border-orange-500",
  },
  {
    id: "mtn",
    name: "MTN Mobile Money",
    icon: "🟡",
    color: "bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500",
  },
  {
    id: "visa",
    name: "Visa",
    icon: "💳",
    color: "bg-blue-500/10 border-blue-500/30 hover:border-blue-500",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    icon: "💳",
    color: "bg-red-500/10 border-red-500/30 hover:border-red-500",
  },
];

const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

const transactions = [
  { id: 1, type: "credit", amount: 5000, method: "Orange Money", date: "2024-01-17 14:30", status: "completed" },
  { id: 2, type: "debit", amount: 1500, service: "Followers TikTok", date: "2024-01-17 10:15", status: "completed" },
  { id: 3, type: "credit", amount: 10000, method: "MTN Mobile Money", date: "2024-01-16 18:45", status: "completed" },
  { id: 4, type: "debit", amount: 2000, service: "Likes Instagram", date: "2024-01-16 09:20", status: "completed" },
  { id: 5, type: "credit", amount: 2500, method: "Visa", date: "2024-01-15 16:00", status: "pending" },
  { id: 6, type: "debit", amount: 3500, service: "Vues YouTube", date: "2024-01-15 11:30", status: "completed" },
];

export default function Wallet() {
  const [balance] = useState(15500);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("recharge");

  const handleRecharge = () => {
    const amount = parseInt(rechargeAmount);
    if (!amount || amount < 500) {
      toast.error("Le montant minimum de recharge est de 500 XAF");
      return;
    }
    if (!selectedMethod) {
      toast.error("Veuillez sélectionner un mode de paiement");
      return;
    }
    toast.success(`Recharge de ${amount.toLocaleString()} XAF initiée via ${paymentMethods.find(m => m.id === selectedMethod)?.name}`);
  };

  const getTransactionIcon = (type: string) => {
    return type === "credit" ? (
      <ArrowDownLeft className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusIcon = (status: string) => {
    return status === "completed" ? (
      <CheckCircle2 className="w-4 h-4 text-green-500" />
    ) : (
      <Clock className="w-4 h-4 text-yellow-500" />
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Mon <span className="gradient-text">Portefeuille</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gérez votre solde et effectuez des recharges en toute sécurité
            </p>
          </div>

          {/* Balance Card */}
          <Card className="max-w-xl mx-auto mb-8 overflow-hidden">
            <div className="gradient-primary p-6 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <WalletIcon className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Solde disponible</span>
                </div>
                <Badge className="bg-white/20 text-white hover:bg-white/30">XAF</Badge>
              </div>
              <p className="text-4xl md:text-5xl font-bold">
                {balance.toLocaleString()} <span className="text-xl font-normal">FCFA</span>
              </p>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                Montant minimum de recharge : 500 XAF
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
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
            <TabsContent value="recharge">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Amount Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Montant de recharge</CardTitle>
                    <CardDescription>Choisissez ou saisissez un montant</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={rechargeAmount === amount.toString() ? "default" : "outline"}
                          className={rechargeAmount === amount.toString() ? "gradient-primary" : ""}
                          onClick={() => setRechargeAmount(amount.toString())}
                        >
                          {amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Montant personnalisé"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        className="pr-16"
                        min={500}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        XAF
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mode de paiement</CardTitle>
                    <CardDescription>Sélectionnez votre méthode préférée</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          method.color
                        } ${
                          selectedMethod === method.id
                            ? "ring-2 ring-primary ring-offset-2"
                            : ""
                        }`}
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                        {method.id.includes("visa") || method.id.includes("mastercard") ? (
                          <CreditCard className="w-4 h-4 ml-auto text-muted-foreground" />
                        ) : (
                          <Smartphone className="w-4 h-4 ml-auto text-muted-foreground" />
                        )}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Confirm Button */}
              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  className="gradient-primary glow min-w-[200px]"
                  onClick={handleRecharge}
                  disabled={!rechargeAmount || !selectedMethod}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Recharger {rechargeAmount ? `${parseInt(rechargeAmount).toLocaleString()} XAF` : ""}
                </Button>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des transactions</CardTitle>
                  <CardDescription>Toutes vos opérations récentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === "credit" ? "bg-green-500/10" : "bg-red-500/10"
                          }`}>
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {tx.type === "credit" ? tx.method : tx.service}
                            </p>
                            <p className="text-sm text-muted-foreground">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className={`font-bold ${
                              tx.type === "credit" ? "text-green-500" : "text-foreground"
                            }`}>
                              {tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString()} XAF
                            </p>
                          </div>
                          {getStatusIcon(tx.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
