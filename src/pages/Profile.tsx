import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  Crown,
  Copy,
  Users,
  Gift,
  Bell,
  Mail,
  MessageSquare,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const user = {
  name: "Jean Dupont",
  email: "jean.dupont@email.com",
  phone: "+237 620462308",
  tier: "gold" as const,
  points: 2450,
  nextTierPoints: 5000,
  referralCode: "JEAN2024",
  referralEarnings: 125.50,
  referralCount: 8,
};

const tierConfig = {
  bronze: { name: "Bronze", color: "bg-bronze", minPoints: 0, discount: 0 },
  silver: { name: "Argent", color: "bg-silver", minPoints: 1000, discount: 5 },
  gold: { name: "Or", color: "bg-gold", minPoints: 2500, discount: 10 },
  platinum: { name: "Platine", color: "bg-platinum", minPoints: 5000, discount: 15 },
};

const settingsItems = [
  { icon: Bell, label: "Notifications push", hasToggle: true, enabled: true },
  { icon: Mail, label: "Alertes email", hasToggle: true, enabled: true },
  { icon: MessageSquare, label: "SMS transactions", hasToggle: true, enabled: false },
  { icon: Shield, label: "Sécurité du compte", hasArrow: true },
  { icon: HelpCircle, label: "Centre d'aide", hasArrow: true, href: "/support" },
];

export default function Profile() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
  });

  const currentTier = tierConfig[user.tier];
  const tierProgress = (user.points / user.nextTierPoints) * 100;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://avyboost.com/ref/${user.referralCode}`);
    toast.success("Lien de parrainage copié !");
  };

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
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-white/80 text-sm">{user.email}</p>
                <Badge className={`${currentTier.color} text-white mt-2`}>
                  <Crown className="w-3 h-3 mr-1" />
                  {currentTier.name}
                </Badge>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Programme fidélité</span>
              <span className="font-medium">{user.points.toLocaleString()} / {user.nextTierPoints.toLocaleString()} pts</span>
            </div>
            <Progress value={tierProgress} className="h-2" />
            <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-primary/5">
              <Gift className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">-{currentTier.discount}% sur toutes vos commandes</span>
            </div>
          </CardContent>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-2xl font-bold text-primary">{user.referralCount}</p>
                <p className="text-xs text-muted-foreground">Filleuls</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-2xl font-bold text-green-500">{user.referralEarnings.toFixed(0)} XAF</p>
                <p className="text-xs text-muted-foreground">Gains</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm font-mono truncate">
                avyboost.com/ref/{user.referralCode}
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
        <Button variant="outline" className="w-full text-destructive hover:text-destructive" asChild>
          <Link to="/auth">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Link>
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
