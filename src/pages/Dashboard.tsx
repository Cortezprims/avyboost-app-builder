import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Zap,
  ShoppingCart,
  Clock,
  CheckCircle2,
  TrendingUp,
  Gift,
  Copy,
  Users,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
  History,
  Crown,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

// Mock data
const user = {
  name: "Jean Dupont",
  email: "jean.dupont@email.com",
  tier: "gold" as const,
  points: 2450,
  nextTierPoints: 5000,
  referralCode: "JEAN2024",
  referralEarnings: 125.50,
  referralCount: 8,
};

const tierConfig = {
  bronze: { name: "Bronze", color: "bg-bronze text-white", minPoints: 0, discount: 0 },
  silver: { name: "Argent", color: "bg-silver text-white", minPoints: 1000, discount: 5 },
  gold: { name: "Or", color: "bg-gold text-white", minPoints: 2500, discount: 10 },
  platinum: { name: "Platine", color: "bg-platinum text-white", minPoints: 5000, discount: 15 },
};

const orders = [
  { id: "ORD-001", service: "Followers TikTok", quantity: 1000, status: "completed", date: "2024-01-15", amount: 17.99 },
  { id: "ORD-002", service: "Likes Instagram", quantity: 500, status: "processing", date: "2024-01-16", amount: 6.99 },
  { id: "ORD-003", service: "Vues YouTube", quantity: 5000, status: "pending", date: "2024-01-17", amount: 19.99 },
];

const stats = [
  { label: "Commandes totales", value: "24", icon: ShoppingCart, color: "text-primary" },
  { label: "En cours", value: "2", icon: Clock, color: "text-gold" },
  { label: "Complétées", value: "22", icon: CheckCircle2, color: "text-green-500" },
  { label: "Économies", value: "45€", icon: TrendingUp, color: "text-primary" },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", id: "dashboard" },
  { icon: History, label: "Historique", id: "history" },
  { icon: Crown, label: "Fidélité", id: "loyalty" },
  { icon: Share2, label: "Parrainage", id: "referral" },
  { icon: CreditCard, label: "Paiements", id: "payments" },
  { icon: Settings, label: "Paramètres", id: "settings" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const currentTier = tierConfig[user.tier];
  const tierProgress = (user.points / user.nextTierPoints) * 100;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://avyboost.com/ref/${user.referralCode}`);
    toast.success("Lien de parrainage copié !");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Terminée</Badge>;
      case "processing":
        return <Badge className="bg-gold/10 text-gold hover:bg-gold/20">En cours</Badge>;
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r hidden md:flex flex-col">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">AvyBoost</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <Badge className={currentTier.color + " text-xs"}>{currentTier.name}</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-6">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">AvyBoost</span>
          </Link>
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Bienvenue, {user.name.split(" ")[0]} ! 👋
          </h1>
          <p className="text-muted-foreground">Voici un aperçu de votre activité.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Commandes récentes
              </CardTitle>
              <CardDescription>Vos 3 dernières commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{order.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.quantity.toLocaleString()} • {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.amount.toFixed(2)}€</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir tout l'historique
              </Button>
            </CardContent>
          </Card>

          {/* Loyalty Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold" />
                Programme Fidélité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5">
                <Badge className={currentTier.color + " text-lg px-4 py-1 mb-2"}>
                  {currentTier.name}
                </Badge>
                <p className="text-3xl font-bold">{user.points.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">points</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Prochain niveau</span>
                  <span className="font-medium">{user.nextTierPoints.toLocaleString()} pts</span>
                </div>
                <Progress value={tierProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Plus que {(user.nextTierPoints - user.points).toLocaleString()} points
                </p>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium mb-1">
                  <Gift className="w-4 h-4 inline mr-1 text-primary" />
                  Avantage actuel
                </p>
                <p className="text-lg font-bold text-primary">
                  -{currentTier.discount}% sur toutes vos commandes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Programme de Parrainage
            </CardTitle>
            <CardDescription>
              Gagnez 10% de commission sur chaque commande de vos filleuls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-primary">{user.referralCount}</p>
                <p className="text-sm text-muted-foreground">Filleuls actifs</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-green-500">{user.referralEarnings.toFixed(2)}€</p>
                <p className="text-sm text-muted-foreground">Gains totaux</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Votre lien de parrainage</p>
                <div className="flex gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-background text-sm truncate">
                    avyboost.com/ref/{user.referralCode}
                  </code>
                  <Button size="icon" variant="outline" onClick={copyReferralCode}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action */}
        <div className="mt-6 text-center">
          <Button size="lg" className="gradient-primary glow" asChild>
            <Link to="/services">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Nouvelle commande
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
