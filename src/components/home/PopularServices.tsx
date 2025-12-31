import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { platformConfig, PlatformKey } from "@/components/icons/SocialIcons";

const popularServices = [
  {
    id: 1,
    name: "Followers TikTok",
    platform: "tiktok" as PlatformKey,
    price: "1,500",
    unit: "100 followers",
    badge: "Populaire",
    badgeColor: "bg-pink-500",
  },
  {
    id: 2,
    name: "Likes Instagram",
    platform: "instagram" as PlatformKey,
    price: "1,000",
    unit: "100 likes",
    badge: "Rapide",
    badgeColor: "bg-purple-500",
  },
  {
    id: 3,
    name: "Vues YouTube",
    platform: "youtube" as PlatformKey,
    price: "2,500",
    unit: "1000 vues",
    badge: "Premium",
    badgeColor: "bg-red-500",
  },
  {
    id: 4,
    name: "Membres Telegram",
    platform: "telegram" as PlatformKey,
    price: "2,500",
    unit: "100 membres",
    badge: "Garanti",
    badgeColor: "bg-blue-500",
  },
];

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
        {popularServices.map((service) => {
          const platform = platformConfig[service.platform];
          const IconComponent = platform.icon;
          
          return (
            <Link key={service.id} to={`/services/${service.platform}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl ${platform.color} flex items-center justify-center`}>
                      <IconComponent className={platform.textColor} size={20} />
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
          );
        })}
      </div>
    </section>
  );
}
