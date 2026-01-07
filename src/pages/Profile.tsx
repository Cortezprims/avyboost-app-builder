import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import {
  Copy,
  Users,
  Bell,
  Mail,
  MessageSquare,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const settingsItems = [
  { icon: Bell, label: "Notifications push", hasToggle: true, enabled: true },
  { icon: Mail, label: "Alertes email", hasToggle: true, enabled: true },
  { icon: MessageSquare, label: "SMS transactions", hasToggle: true, enabled: false },
  { icon: Shield, label: "Sécurité du compte", hasArrow: true },
  { icon: HelpCircle, label: "Centre d'aide", hasArrow: true, href: "/support" },
];

export default function Profile() {
  const { user, profile, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/auth");
    } catch (error: any) {
      toast.error("Erreur lors de la déconnexion");
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const copyReferralCode = () => {
    const code = profile?.referralCode || "AVYBOOST";
    navigator.clipboard.writeText(`https://avyboost.com/ref/${code}`);
    toast.success("Lien de parrainage copié !");
  };

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
        <p className="text-lg font-medium mb-2">Connexion requise</p>
        <Button asChild className="gradient-primary">
          <Link to="/auth">Se connecter</Link>
        </Button>
      </div>
    );
  }

  const userName = profile?.displayName || user.email?.split('@')[0] || 'Utilisateur';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <h1 className="font-display font-bold text-lg">Profil</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="gradient-primary p-6 text-primary-foreground">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{userName}</h2>
                <p className="text-white/80 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Referral Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5 text-primary" />
              Programme de Parrainage
            </CardTitle>
            <CardDescription>Gagnez 10% sur les commandes de vos filleuls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm font-mono truncate">
                avyboost.com/ref/{profile?.referralCode || "AVYBOOST"}
              </div>
              <Button size="icon" variant="outline" onClick={copyReferralCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Paramètres</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {settingsItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href || "#"}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.hasToggle && (
                    <Switch 
                      checked={item.enabled}
                      onCheckedChange={() => {}}
                    />
                  )}
                  {item.hasArrow && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="outline" 
          className="w-full text-destructive hover:text-destructive" 
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          Déconnexion
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
