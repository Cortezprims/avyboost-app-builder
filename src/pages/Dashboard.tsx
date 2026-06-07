import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PromotionsCarousel } from "@/components/home/PromotionsCarousel";
import { PopularServices } from "@/components/home/PopularServices";
import { AdminHub } from "@/components/admin/AdminHub";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useWallet, useOrders } from "@/hooks/useFirestore";
import {
  Zap,
  Wallet,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Plus,
  Loader2,
  RefreshCw,
  Sparkles,
  Headphones,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const { balance, refreshBalance } = useWallet();
  const { orders, stats } = useOrders();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try { await refreshBalance(); } catch {}
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const recentOrders = orders.slice(0, 2);

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
        <Zap className="w-16 h-16 text-primary mb-4" />
        <p className="text-lg font-medium mb-2">Bienvenue sur AvyBoost</p>
        <p className="text-muted-foreground text-center mb-4">
          Connectez-vous pour accéder à votre tableau de bord
        </p>
        <Button asChild className="gradient-primary">
          <Link to="/auth">Se connecter</Link>
        </Button>
      </div>
    );
  }

  const userName = profile?.displayName || user.email?.split('@')[0] || 'Utilisateur';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Ambient background glow */}
      <div className="fixed inset-0 -z-10 gradient-hero opacity-60 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center glow">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="gradient-text">Avy</span>Boost
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell />
              <Link to="/profile">
                <Avatar className="w-9 h-9 ring-2 ring-primary/30">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-5xl">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Salut, <span className="gradient-text">{userName.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Votre hub pour booster vos réseaux sociaux.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 auto-rows-[minmax(0,auto)]">
          {/* Balance hero — large */}
          <Card className="col-span-4 sm:col-span-3 row-span-2 border-0 shadow-elegant overflow-hidden group">
            <CardContent className="p-0 h-full">
              <div className="gradient-primary p-6 text-primary-foreground h-full flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
                <div className="relative">
                  <p className="text-sm text-white/80 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Solde disponible
                  </p>
                  <p className="text-4xl sm:text-5xl font-display font-bold mt-2 tracking-tight">
                    {balance.toLocaleString()}
                    <span className="text-xl ml-2 font-medium opacity-80">XAF</span>
                  </p>
                </div>
                <div className="relative flex items-center gap-2 mt-6">
                  <Button asChild size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur flex-1 sm:flex-none">
                    <Link to="/wallet">
                      <Plus className="w-4 h-4 mr-1" />
                      Recharger
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-white hover:bg-white/20"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions — right column */}
          <Link to="/services" className="col-span-2 sm:col-span-1 group">
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-elegant cursor-pointer">
              <CardContent className="p-4 flex flex-col items-start justify-between h-full min-h-[100px]">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Nouvelle commande</p>
                  <p className="text-[10px] text-muted-foreground">Explorez les services</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/support" className="col-span-2 sm:col-span-1 group">
            <Card className="h-full hover:border-accent/50 transition-all hover:shadow-elegant cursor-pointer">
              <CardContent className="p-4 flex flex-col items-start justify-between h-full min-h-[100px]">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Headphones className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Support</p>
                  <p className="text-[10px] text-muted-foreground">Aide & contact</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Stats bento */}
          <Card className="col-span-4 sm:col-span-2 lg:col-span-1 hover:shadow-card-elegant transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-display font-bold leading-none">{stats.total}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Commandes totales</p>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-1 hover:shadow-card-elegant transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-display font-bold leading-none">{stats.processing + stats.pending}</p>
                <p className="text-[11px] text-muted-foreground mt-1">En cours</p>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-2 hover:shadow-card-elegant transition-all">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-display font-bold leading-none">{stats.completed}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Complétées avec succès</p>
              </div>
              <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />
            </CardContent>
          </Card>
        </div>

        {/* Admin Hub (collapsed by tabs, only for admin) */}
        <AdminHub userEmail={user.email || undefined} />

        <PromotionsCarousel />

        <PopularServices />

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Commandes récentes
              </h2>
              <Link to="/orders" className="text-sm text-primary font-medium">Voir tout</Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-card-elegant transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{order.service}</p>
                        <p className="text-xs text-muted-foreground">{order.id?.slice(0, 8)}...</p>
                      </div>
                      <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                        {order.status === "completed" ? "Terminée" : "En cours"}
                      </Badge>
                    </div>
                    <Progress value={(order.delivered / order.quantity) * 100} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <Button size="lg" className="w-full gradient-primary glow" asChild>
          <Link to="/services">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Nouvelle commande
          </Link>
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
