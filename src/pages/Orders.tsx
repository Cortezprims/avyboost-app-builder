import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  RotateCcw,
  Zap,
  ShoppingCart,
  ArrowLeft,
  Timer,
} from "lucide-react";
import { toast } from "sonner";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

interface Order {
  id: string;
  service: string;
  platform: string;
  quantity: number;
  delivered: number;
  status: OrderStatus;
  date: string;
  amount: number;
  deliveryType: "standard" | "express";
}

const orders: Order[] = [
  { id: "ORD-001", service: "Followers TikTok", platform: "tiktok", quantity: 1000, delivered: 1000, status: "completed", date: "Aujourd'hui, 14:30", amount: 9000, deliveryType: "express" },
  { id: "ORD-002", service: "Likes Instagram", platform: "instagram", quantity: 500, delivered: 320, status: "processing", date: "Aujourd'hui, 10:15", amount: 3500, deliveryType: "standard" },
  { id: "ORD-003", service: "Vues YouTube", platform: "youtube", quantity: 5000, delivered: 0, status: "pending", date: "Hier, 09:00", amount: 10000, deliveryType: "standard" },
  { id: "ORD-004", service: "Abonnés Twitter", platform: "twitter", quantity: 200, delivered: 0, status: "cancelled", date: "15 Jan, 16:45", amount: 2600, deliveryType: "express" },
];

const platformIcons: Record<string, string> = {
  tiktok: "📱",
  instagram: "📸",
  facebook: "👍",
  youtube: "🎬",
  twitter: "🐦",
  telegram: "✈️",
};

const statusConfig: Record<OrderStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  completed: { label: "Terminée", icon: CheckCircle2, color: "text-green-500 bg-green-500/10" },
  processing: { label: "En cours", icon: RefreshCw, color: "text-yellow-500 bg-yellow-500/10" },
  pending: { label: "En attente", icon: Clock, color: "text-blue-500 bg-blue-500/10" },
  cancelled: { label: "Annulée", icon: XCircle, color: "text-red-500 bg-red-500/10" },
};

export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");

  const handleRepeatOrder = (orderId: string) => {
    toast.success(`Commande ${orderId} ajoutée au panier`);
  };

  const handleCancelOrder = (orderId: string) => {
    toast.success(`Annulation demandée pour ${orderId}`);
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "completed").length,
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
              <h1 className="font-display font-bold text-lg">Commandes</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <CardContent className="p-3">
              <Package className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <RefreshCw className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-xl font-bold">{stats.processing}</p>
              <p className="text-[10px] text-muted-foreground">En cours</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-500" />
              <p className="text-xl font-bold">{stats.completed}</p>
              <p className="text-[10px] text-muted-foreground">Terminées</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">En cours</TabsTrigger>
            <TabsTrigger value="completed">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredOrders.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium mb-2">Aucune commande</p>
                  <Button size="sm" asChild className="gradient-primary">
                    <Link to="/services">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Commander
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status];
                  const progress = (order.delivered / order.quantity) * 100;

                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{platformIcons[order.platform]}</span>
                            <div>
                              <h3 className="font-semibold">{order.service}</h3>
                              <p className="text-xs text-muted-foreground">{order.id}</p>
                            </div>
                          </div>
                          <Badge className={config.color}>
                            <config.icon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>

                        {order.status === "processing" && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progression</span>
                              <span className="font-medium">{order.delivered} / {order.quantity}</span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span>{order.date}</span>
                            {order.deliveryType === "express" && (
                              <Badge variant="secondary" className="text-[10px]">
                                <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                                Express
                              </Badge>
                            )}
                          </div>
                          <span className="font-bold text-primary">{order.amount.toLocaleString()} XAF</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          {order.status === "completed" && (
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleRepeatOrder(order.id)}>
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Répéter
                            </Button>
                          )}
                          {(order.status === "pending" || order.status === "processing") && (
                            <Button variant="outline" size="sm" className="flex-1 text-destructive" onClick={() => handleCancelOrder(order.id)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              Annuler
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

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
