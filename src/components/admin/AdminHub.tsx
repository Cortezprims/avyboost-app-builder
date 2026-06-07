import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, Users, ShoppingCart, Receipt, Bell, Coins, Code2 } from "lucide-react";
import { AdminUsersPanel } from "./AdminUsersPanel";
import { AdminOrdersPanel } from "./AdminOrdersPanel";
import { AdminTransactionsPanel } from "./AdminTransactionsPanel";
import { AdminNotifications } from "./AdminNotifications";
import { ExoBoosterBalance } from "./ExoBoosterBalance";

const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

export function AdminHub({ userEmail }: { userEmail?: string }) {
  if (userEmail !== ADMIN_EMAIL) return null;

  return (
    <Card className="border-primary/20 shadow-elegant overflow-hidden animate-fade-in">
      <div className="gradient-primary px-5 py-4 flex items-center justify-between text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg leading-tight">Espace Administrateur</h2>
            <p className="text-xs text-white/80">Gestion centralisée d'AvyBoost</p>
          </div>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-muted/50 p-1">
            <TabsTrigger value="users" className="gap-1.5 text-xs"><Users className="w-3.5 h-3.5" />Utilisateurs</TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5 text-xs"><ShoppingCart className="w-3.5 h-3.5" />Commandes</TabsTrigger>
            <TabsTrigger value="tx" className="gap-1.5 text-xs"><Receipt className="w-3.5 h-3.5" />Transactions</TabsTrigger>
            <TabsTrigger value="notif" className="gap-1.5 text-xs"><Bell className="w-3.5 h-3.5" />Notifications</TabsTrigger>
            <TabsTrigger value="exo" className="gap-1.5 text-xs"><Coins className="w-3.5 h-3.5" />ExoBooster</TabsTrigger>
            <TabsTrigger value="code" className="gap-1.5 text-xs"><Code2 className="w-3.5 h-3.5" />Code</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4"><AdminUsersPanel userEmail={userEmail} /></TabsContent>
          <TabsContent value="orders" className="mt-4"><AdminOrdersPanel userEmail={userEmail} /></TabsContent>
          <TabsContent value="tx" className="mt-4"><AdminTransactionsPanel userEmail={userEmail} /></TabsContent>
          <TabsContent value="notif" className="mt-4"><AdminNotifications userEmail={userEmail} /></TabsContent>
          <TabsContent value="exo" className="mt-4"><ExoBoosterBalance userEmail={userEmail} /></TabsContent>
          <TabsContent value="code" className="mt-4">
            <div className="text-center py-6 space-y-3">
              <Code2 className="w-12 h-12 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Accédez à la page d'export du code source complet</p>
              <Button asChild className="gradient-primary glow">
                <Link to="/admin/code"><Code2 className="w-4 h-4 mr-2" />Ouvrir l'export</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}