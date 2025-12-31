import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useOrders } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { Timestamp } from "firebase/firestore";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

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
  const { user, loading: authLoading } = useAuth();
  const { orders, loading, stats, cancelOrder } = useOrders();
  const [activeTab, setActiveTab] = useState("active");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);
      toast.success("Commande annulée et remboursée");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'annulation");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Aujourd'hui, ${time}`;
    if (isYesterday) return `Hier, ${time}`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + `, ${time}`;
  };

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
  const historyOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');
  const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

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
        <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium mb-2">Connexion requise</p>
        <p className="text-muted-foreground text-center mb-4">
          Connectez-vous pour voir vos commandes
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
              <p className="text-xl font-bold">{stats.processing + stats.pending}</p>
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
            <TabsTrigger value="active">
              En cours ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              Historique ({historyOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : displayedOrders.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium mb-2">
                    {activeTab === 'active' ? 'Aucune commande en cours' : 'Aucun historique'}
                  </p>
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
                {displayedOrders.map((order) => {
                  const config = statusConfig[order.status as OrderStatus];
                  const progress = order.quantity > 0 ? (order.delivered / order.quantity) * 100 : 0;

                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{platformIcons[order.platform] || "📱"}</span>
                            <div>
                              <h3 className="font-semibold">{order.service}</h3>
                              <p className="text-xs text-muted-foreground">{order.id?.slice(0, 8)}...</p>
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
                            <span>{formatDate(order.createdAt)}</span>
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
                            <Button variant="outline" size="sm" className="flex-1" asChild>
                              <Link to={`/services/${order.platform}`}>
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Répéter
                              </Link>
                            </Button>
                          )}
                          {order.status === "pending" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 text-destructive" 
                              onClick={() => order.id && handleCancelOrder(order.id)}
                              disabled={cancellingId === order.id}
                            >
                              {cancellingId === order.id ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-1" />
                              )}
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
