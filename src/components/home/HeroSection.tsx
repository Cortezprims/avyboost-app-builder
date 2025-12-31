import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Zap, Shield, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2 text-gold fill-gold" />
            +50 000 clients satisfaits
          </Badge>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Boostez votre{" "}
            <span className="gradient-text">présence sociale</span>
            {" "}en quelques clics
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Likes, followers, vues, commentaires — obtenez des résultats rapides et sécurisés 
            sur TikTok, Instagram, Facebook, YouTube et plus encore.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/services">
              <Button size="lg" className="gradient-primary glow text-lg px-8 h-14">
                Découvrir nos services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                Comment ça marche ?
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span>Livraison instantanée</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span>100% sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span>Support 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span>Garantie résultats</span>
            </div>
          </div>
        </div>

        {/* Floating platform icons - positioned below hero content */}
        <div className="mt-16 flex justify-center gap-4 opacity-60">
          <div className="w-12 h-12 rounded-2xl bg-card shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0s' }}>
            <span className="text-2xl">📱</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-card shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0.1s' }}>
            <span className="text-2xl">📸</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-card shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0.2s' }}>
            <span className="text-2xl">🎬</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-card shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0.3s' }}>
            <span className="text-2xl">💬</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-card shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0.4s' }}>
            <span className="text-2xl">🐦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
