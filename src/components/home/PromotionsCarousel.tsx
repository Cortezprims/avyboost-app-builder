import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles, Zap, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const promotions = [
  {
    id: 1,
    title: "Bienvenue !",
    description: "20% de réduction sur votre première commande",
    code: "WELCOME20",
    bgClass: "gradient-primary",
    icon: Gift,
  },
  {
    id: 2,
    title: "Pack TikTok",
    description: "1000 followers + 500 likes offerts",
    price: "4,999 XAF",
    bgClass: "bg-gradient-to-r from-pink-500 to-rose-500",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Livraison Express",
    description: "Résultats garantis en moins de 30 min",
    bgClass: "bg-gradient-to-r from-cyan-500 to-blue-500",
    icon: Zap,
  },
];

export function PromotionsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % promotions.length);
  const prev = () => setCurrent((prev) => (prev - 1 + promotions.length) % promotions.length);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {promotions.map((promo) => (
            <Card 
              key={promo.id}
              className={`flex-shrink-0 w-full border-0 ${promo.bgClass} text-white`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge className="bg-white/20 text-white mb-2 hover:bg-white/30">
                      Offre spéciale
                    </Badge>
                    <h3 className="text-xl font-bold mb-1">{promo.title}</h3>
                    <p className="text-white/90 text-sm mb-4">{promo.description}</p>
                    {promo.code && (
                      <code className="px-3 py-1 rounded-lg bg-white/20 text-sm font-mono">
                        {promo.code}
                      </code>
                    )}
                    {promo.price && (
                      <p className="text-2xl font-bold">{promo.price}</p>
                    )}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <promo.icon className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current 
                ? "w-6 bg-primary" 
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Navigation arrows for larger screens */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:flex bg-white/80 dark:bg-background/80 hover:bg-white dark:hover:bg-background shadow-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex bg-white/80 dark:bg-background/80 hover:bg-white dark:hover:bg-background shadow-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
