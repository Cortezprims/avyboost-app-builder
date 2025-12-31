import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Zap } from "lucide-react";

const popularServices = [
  {
    id: 1,
    name: "Followers TikTok",
    platform: "tiktok",
    price: "500",
    unit: "100 followers",
    badge: "Populaire",
    badgeColor: "bg-pink-500",
  },
  {
    id: 2,
    name: "Likes Instagram",
    platform: "instagram",
    price: "300",
    unit: "50 likes",
    badge: "Rapide",
    badgeColor: "bg-purple-500",
  },
  {
    id: 3,
    name: "Vues YouTube",
    platform: "youtube",
    price: "1,000",
    unit: "500 vues",
    badge: "Premium",
    badgeColor: "bg-red-500",
  },
  {
    id: 4,
    name: "Abonnés Telegram",
    platform: "telegram",
    price: "800",
    unit: "100 abonnés",
    badge: "Garanti",
    badgeColor: "bg-blue-500",
  },
];

const platformColors: Record<string, string> = {
  tiktok: "bg-gradient-to-br from-pink-500 to-rose-600",
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  youtube: "bg-gradient-to-br from-red-500 to-red-600",
  telegram: "bg-gradient-to-br from-blue-400 to-blue-600",
};

export function PopularServices() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Services populaires
        </h2>
        <Link to="/services" className="text-sm text-primary font-medium">
          Voir tout
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {popularServices.map((service) => (
          <Link key={service.id} to={`/services/${service.platform}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${platformColors[service.platform]} flex items-center justify-center`}>
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <Badge className={`${service.badgeColor} text-white text-[10px] px-2`}>
                    {service.badge}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{service.unit}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">{service.price}</span>
                  <span className="text-xs text-muted-foreground">XAF</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
