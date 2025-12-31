import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  RotateCcw,
  Zap,
  Timer,
  ShoppingCart,
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
  targetUrl: string;
  deliveryType: "standard" | "express";
  estimatedTime: string;
}

const orders: Order[] = [
  {
    id: "ORD-2024-001",
    service: "Followers TikTok",
    platform: "tiktok",
    quantity: 1000,
    delivered: 1000,
    status: "completed",
    date: "2024-01-17 14:30",
    amount: 17990,
    targetUrl: "https://tiktok.com/@user123",
    deliveryType: "express",
    estimatedTime: "Livré",
  },
  {
    id: "ORD-2024-002",
    service: "Likes Instagram",
    platform: "instagram",
    quantity: 500,
    delivered: 320,
    status: "processing",
    date: "2024-01-17 10:15",
    amount: 6990,
    targetUrl: "https://instagram.com/p/abc123",
    deliveryType: "standard",
    estimatedTime: "~2h restantes",
  },
  {
    id: "ORD-2024-003",
    service: "Vues YouTube",
    platform: "youtube",
    quantity: 5000,
    delivered: 0,
    status: "pending",
    date: "2024-01-17 09:00",
    amount: 19990,
    targetUrl: "https://youtube.com/watch?v=xyz",
    deliveryType: "standard",
    estimatedTime: "En attente",
  },
  {
    id: "ORD-2024-004",
    service: "Abonnés Twitter",
    platform: "twitter",
    quantity: 200,
    delivered: 0,
    status: "cancelled",
    date: "2024-01-16 16:45",
    amount: 7990,
    targetUrl: "https://twitter.com/user",
    deliveryType: "express",
    estimatedTime: "Annulée",
  },
];

const platformIcons: Record<string, string> = {
  tiktok: "📱",
  instagram: "📸",
  facebook: "👍",
  youtube: "🎬",
  twitter: "🐦",
  telegram: "✈️",
};

export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return {
          label: "Terminée",
          icon: CheckCircle2,
          className: "bg-green-500/10 text-green-600 border-green-500/30",
          iconClass: "text-green-500",
        };
      case "processing":
        return {
          label: "En cours",
          icon: RefreshCw,
          className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
          iconClass: "text-yellow-500",
        };
      case "pending":
        return {
          label: "En attente",
          icon: Clock,
          className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
          iconClass: "text-blue-500",
        };
      case "cancelled":
        return {
          label: "Annulée",
          icon: XCircle,
          className: "bg-red-500/10 text-red-600 border-red-500/30",
          iconClass: "text-red-500",
        };
    }
  };

  const handleRepeatOrder = (orderId: string) => {
    toast.success(`Commande ${orderId} dupliquée dans le panier`);
  };

  const handleCancelOrder = (orderId: string) => {
    toast.success(`Demande d'annulation envoyée pour ${orderId}`);
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "completed").length,
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Mes <span className="gradient-text">Commandes</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Suivez vos commandes en temps réel
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-4 text-center">
                <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{stats.processing}</p>
                <p className="text-xs text-muted-foreground">En cours</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Terminées</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="processing">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredOrders.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">Aucune commande</p>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore de commande dans cette catégorie
                    </p>
                    <Button asChild className="gradient-primary">
                      <Link to="/services">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Commander maintenant
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const progress = (order.delivered / order.quantity) * 100;

                    return (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Main Info */}
                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">{platformIcons[order.platform]}</span>
                                  <div>
                                    <h3 className="font-semibold text-lg">{order.service}</h3>
                                    <p className="text-sm text-muted-foreground">{order.id}</p>
                                  </div>
                                </div>
                                <Badge className={statusConfig.className}>
                                  <statusConfig.icon className={`w-3 h-3 mr-1 ${statusConfig.iconClass}`} />
                                  {statusConfig.label}
                                </Badge>
                              </div>

                              {/* Progress Bar */}
                              {order.status === "processing" && (
                                <div className="mb-4">
                                  <div className="flex justify-between text-sm mb-2">
                                    <span>Progression</span>
                                    <span className="font-medium">
                                      {order.delivered.toLocaleString()} / {order.quantity.toLocaleString()}
                                    </span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                              )}

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Quantité</p>
                                  <p className="font-medium">{order.quantity.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Montant</p>
                                  <p className="font-medium">{order.amount.toLocaleString()} XAF</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Date</p>
                                  <p className="font-medium">{order.date}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground flex items-center gap-1">
                                    <Timer className="w-3 h-3" />
                                    Livraison
                                  </p>
                                  <p className="font-medium flex items-center gap-1">
                                    {order.deliveryType === "express" && (
                                      <Zap className="w-3 h-3 text-yellow-500" />
                                    )}
                                    {order.estimatedTime}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-2 p-4 md:p-6 bg-muted/30 md:border-l justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 md:flex-none"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Détails
                              </Button>
                              {order.status === "completed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 md:flex-none"
                                  onClick={() => handleRepeatOrder(order.id)}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Répéter
                                </Button>
                              )}
                              {(order.status === "pending" || order.status === "processing") && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 md:flex-none text-red-500 hover:text-red-600"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Annuler
                                </Button>
                              )}
                            </div>
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
          <div className="mt-8 text-center">
            <Button size="lg" className="gradient-primary glow" asChild>
              <Link to="/services">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Nouvelle commande
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
