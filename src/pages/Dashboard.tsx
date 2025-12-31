import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PromotionsCarousel } from "@/components/home/PromotionsCarousel";
import { PopularServices } from "@/components/home/PopularServices";
import {
  Zap,
  Wallet,
  ShoppingCart,
  Clock,
  CheckCircle2,
  TrendingUp,
  Bell,
  ChevronRight,
  Plus,
} from "lucide-react";

// Mock data
const user = {
  name: "Jean Dupont",
  balance: 15000,
  tier: "gold" as const,
};

const recentOrders = [
  { id: "ORD-001", service: "Followers TikTok", status: "completed", progress: 100 },
  { id: "ORD-002", service: "Likes Instagram", status: "processing", progress: 65 },
];

const stats = [
  { label: "Commandes", value: "24", icon: ShoppingCart, color: "text-primary" },
  { label: "En cours", value: "2", icon: Clock, color: "text-gold" },
  { label: "Complétées", value: "22", icon: CheckCircle2, color: "text-green-500" },
];

const tierConfig = {
  bronze: { name: "Bronze", color: "bg-bronze" },
  silver: { name: "Argent", color: "bg-silver" },
  gold: { name: "Or", color: "bg-gold" },
  platinum: { name: "Platine", color: "bg-platinum" },
};

export default function Dashboard() {
  const currentTier = tierConfig[user.tier];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">
                <span className="gradient-text">Avy</span>Boost
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-destructive rounded-full border-2 border-background" />
              </Button>
              <Link to="/profile">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome & Balance */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">
              Salut, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-muted-foreground">Prêt à booster vos réseaux ?</p>
          </div>
          <Badge className={`${currentTier.color} text-white`}>
            {currentTier.name}
          </Badge>
        </div>

        {/* Balance Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="gradient-primary p-5 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Solde disponible
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {user.balance.toLocaleString()} <span className="text-lg">XAF</span>
                  </p>
                </div>
                <Link to="/wallet">
                  <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                    <Plus className="w-4 h-4 mr-1" />
                    Recharger
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promotions Carousel */}
        <PromotionsCarousel />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-4">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Services */}
        <PopularServices />

        {/* Recent Orders */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Commandes récentes
            </h2>
            <Link to="/orders" className="text-sm text-primary font-medium">
              Voir tout
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{order.service}</p>
                      <p className="text-xs text-muted-foreground">{order.id}</p>
                    </div>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                      {order.status === "completed" ? "Terminée" : "En cours"}
                    </Badge>
                  </div>
                  <Progress value={order.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {order.progress}%
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Action */}
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
