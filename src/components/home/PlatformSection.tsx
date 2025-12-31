import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { platformConfig, PlatformKey } from "@/components/icons/SocialIcons";

const platforms: {
  id: PlatformKey;
  services: string[];
  popular?: boolean;
}[] = [
  {
    id: "tiktok",
    services: ["Followers", "Likes", "Vues", "Commentaires", "Partages"],
    popular: true,
  },
  {
    id: "instagram",
    services: ["Followers", "Likes", "Vues Reels", "Commentaires", "Story Vues"],
    popular: true,
  },
  {
    id: "facebook",
    services: ["Likes Page", "Followers", "Likes Posts", "Commentaires", "Partages"],
  },
  {
    id: "youtube",
    services: ["Abonnés", "Vues", "Likes", "Commentaires", "Watch Time"],
  },
  {
    id: "twitter",
    services: ["Followers", "Likes", "Retweets", "Commentaires", "Impressions"],
  },
  {
    id: "telegram",
    services: ["Membres Groupe", "Membres Canal", "Vues Posts", "Réactions"],
  },
];

export function PlatformSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Toutes les plateformes,{" "}
            <span className="gradient-text">une seule solution</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Boostez votre présence sur les réseaux sociaux les plus populaires avec des services de qualité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const config = platformConfig[platform.id];
            const IconComponent = config.icon;
            
            return (
              <Card 
                key={platform.id}
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {platform.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Populaire
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl ${config.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <IconComponent className={config.textColor} size={32} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{config.name}</h3>
                  <ul className="space-y-2 mb-6">
                    {platform.services.map((service) => (
                      <li key={service} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {service}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/services/${platform.id}`}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Voir les offres
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
