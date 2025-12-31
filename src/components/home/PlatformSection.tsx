import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const platforms = [
  {
    name: "TikTok",
    icon: "📱",
    color: "from-pink-500 to-red-500",
    services: ["Followers", "Likes", "Vues", "Commentaires", "Partages"],
    href: "/services/tiktok",
    popular: true,
  },
  {
    name: "Instagram",
    icon: "📸",
    color: "from-purple-500 to-pink-500",
    services: ["Followers", "Likes", "Vues Reels", "Commentaires", "Story Vues"],
    href: "/services/instagram",
    popular: true,
  },
  {
    name: "Facebook",
    icon: "👍",
    color: "from-blue-600 to-blue-500",
    services: ["Likes Page", "Followers", "Likes Posts", "Commentaires", "Partages"],
    href: "/services/facebook",
  },
  {
    name: "YouTube",
    icon: "🎬",
    color: "from-red-600 to-red-500",
    services: ["Abonnés", "Vues", "Likes", "Commentaires", "Watch Time"],
    href: "/services/youtube",
  },
  {
    name: "Twitter / X",
    icon: "🐦",
    color: "from-sky-500 to-blue-500",
    services: ["Followers", "Likes", "Retweets", "Commentaires", "Impressions"],
    href: "/services/twitter",
  },
  {
    name: "Telegram",
    icon: "✈️",
    color: "from-cyan-500 to-blue-500",
    services: ["Membres Groupe", "Membres Canal", "Vues Posts", "Réactions"],
    href: "/services/telegram",
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
          {platforms.map((platform) => (
            <Card 
              key={platform.name}
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {platform.popular && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Populaire
                </div>
              )}
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{platform.icon}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{platform.name}</h3>
                <ul className="space-y-2 mb-6">
                  {platform.services.map((service) => (
                    <li key={service} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {service}
                    </li>
                  ))}
                </ul>
                <Link to={platform.href}>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Voir les offres
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
