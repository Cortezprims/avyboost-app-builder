import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
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
  TrendingUp,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

const paymentMethods = [
  { id: "orange", name: "Orange Money", icon: "🟠", color: "border-orange-500/50 bg-orange-500/5" },
  { id: "mtn", name: "MTN MoMo", icon: "🟡", color: "border-yellow-500/50 bg-yellow-500/5" },
  { id: "visa", name: "Visa", icon: "💳", color: "border-blue-500/50 bg-blue-500/5" },
  { id: "mastercard", name: "Mastercard", icon: "💳", color: "border-red-500/50 bg-red-500/5" },
];

const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

const transactions = [
  { id: 1, type: "credit", amount: 5000, method: "Orange Money", date: "Aujourd'hui, 14:30", status: "completed" },
  { id: 2, type: "debit", amount: 1500, service: "Followers TikTok", date: "Aujourd'hui, 10:15", status: "completed" },
  { id: 3, type: "credit", amount: 10000, method: "MTN MoMo", date: "Hier, 18:45", status: "completed" },
  { id: 4, type: "debit", amount: 2000, service: "Likes Instagram", date: "Hier, 09:20", status: "completed" },
  { id: 5, type: "credit", amount: 2500, method: "Visa", date: "15 Jan, 16:00", status: "pending" },
];

export default function Wallet() {
  const [balance] = useState(15500);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("recharge");

  const handleRecharge = () => {
    const amount = parseInt(rechargeAmount);
    if (!amount || amount < 500) {
      toast.error("Montant minimum : 500 XAF");
      return;
    }
    if (!selectedMethod) {
      toast.error("Sélectionnez un mode de paiement");
      return;
    }
    toast.success(`Recharge de ${amount.toLocaleString()} XAF initiée`);
  };

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
            <p className="text-4xl font-bold">
              {balance.toLocaleString()} <span className="text-lg font-normal">FCFA</span>
            </p>
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
              <p className="text-lg font-bold text-green-500">+17,500</p>
              <p className="text-[10px] text-muted-foreground">Recharges ce mois</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <ArrowUpRight className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-lg font-bold">-8,500</p>
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
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${method.color} ${
                      selectedMethod === method.id
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-sm font-medium">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              size="lg"
              className="w-full gradient-primary glow"
              onClick={handleRecharge}
              disabled={!rechargeAmount || !selectedMethod}
            >
              <Plus className="w-5 h-5 mr-2" />
              Recharger {rechargeAmount ? `${parseInt(rechargeAmount).toLocaleString()} XAF` : ""}
            </Button>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-4">
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
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
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
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
