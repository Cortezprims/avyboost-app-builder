import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Loader2, 
  RefreshCw, 
  Package, 
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/lib/firestore";
import { platformConfig, PlatformKey } from "@/components/icons/SocialIcons";

const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

interface AdminOrdersPanelProps {
  userEmail?: string;
}

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

const statusConfig: Record<OrderStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  completed: { label: "Terminée", icon: CheckCircle2, color: "text-green-500 bg-green-500/10" },
  processing: { label: "En cours", icon: RefreshCw, color: "text-yellow-500 bg-yellow-500/10" },
  pending: { label: "En attente", icon: Clock, color: "text-blue-500 bg-blue-500/10" },
  cancelled: { label: "Annulée", icon: XCircle, color: "text-red-500 bg-red-500/10" },
};

export function AdminOrdersPanel({ userEmail }: AdminOrdersPanelProps) {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const isAdmin = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to ALL orders (admin only)
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setAllOrders(orders);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching all orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp?.toDate) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Filter orders
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.targetUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    processing: allOrders.filter(o => o.status === 'processing').length,
    completed: allOrders.filter(o => o.status === 'completed').length,
    cancelled: allOrders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="w-5 h-5 text-primary" />
          Panel Admin - Toutes les Commandes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold">{stats.total}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10">
            <p className="text-lg font-bold text-blue-500">{stats.pending}</p>
            <p className="text-[10px] text-muted-foreground">Attente</p>
          </div>
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <p className="text-lg font-bold text-yellow-500">{stats.processing}</p>
            <p className="text-[10px] text-muted-foreground">En cours</p>
          </div>
          <div className="p-2 rounded-lg bg-green-500/10">
            <p className="text-lg font-bold text-green-500">{stats.completed}</p>
            <p className="text-[10px] text-muted-foreground">Terminées</p>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10">
            <p className="text-lg font-bold text-red-500">{stats.cancelled}</p>
            <p className="text-[10px] text-muted-foreground">Annulées</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md border bg-background text-sm"
          >
            <option value="all">Tous</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucune commande trouvée</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-center">Quantité</TableHead>
                  <TableHead className="text-center">Progression</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status as OrderStatus];
                  const progress = order.quantity > 0 ? (order.delivered / order.quantity) * 100 : 0;
                  const StatusIcon = config.icon;

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id?.slice(0, 6)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.service}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {order.targetUrl}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{order.quantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="h-1.5 w-16" />
                          <span className="text-xs">{order.delivered}/{order.quantity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {order.amount.toLocaleString()} XAF
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${config.color} text-xs`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
