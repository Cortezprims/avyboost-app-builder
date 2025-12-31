import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Marie L.",
    role: "Influenceuse Mode",
    content: "Grâce à AvyBoost, j'ai pu atteindre 100K followers sur Instagram en 3 mois. Le service est impeccable et le support très réactif !",
    rating: 5,
    avatar: "ML",
  },
  {
    name: "Thomas B.",
    role: "Créateur TikTok",
    content: "La qualité des followers est excellente. Pas de bots, des vrais profils qui interagissent. Je recommande à 100% !",
    rating: 5,
    avatar: "TB",
  },
  {
    name: "Sophie M.",
    role: "Entrepreneuse",
    content: "J'utilise AvyBoost pour ma marque depuis 6 mois. Les résultats sont constants et m'ont aidée à développer ma visibilité.",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "Lucas D.",
    role: "YouTuber Gaming",
    content: "Le boost de vues sur YouTube m'a permis d'atteindre le seuil de monétisation. Merci AvyBoost !",
    rating: 5,
    avatar: "LD",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Ce que disent nos <span className="gradient-text">clients</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des milliers de créateurs et marques nous font confiance pour leur croissance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
