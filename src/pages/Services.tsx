import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Check, Zap, Clock, Shield, Star, Timer, Sparkles } from "lucide-react";
import { toast } from "sonner";

const platforms = [
  { id: "tiktok", name: "TikTok", icon: "📱", color: "bg-black" },
  { id: "instagram", name: "Instagram", icon: "📸", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "facebook", name: "Facebook", icon: "👍", color: "bg-blue-600" },
  { id: "youtube", name: "YouTube", icon: "🎬", color: "bg-red-600" },
  { id: "twitter", name: "Twitter/X", icon: "🐦", color: "bg-black" },
  { id: "telegram", name: "Telegram", icon: "✈️", color: "bg-blue-500" },
];

const serviceTypes = [
  { id: "all", name: "Tous" },
  { id: "followers", name: "Followers/Abonnés" },
  { id: "likes", name: "Likes" },
  { id: "views", name: "Vues" },
  { id: "comments", name: "Commentaires" },
];

const qualityBadges = {
  fast: { label: "Rapide", icon: Zap, color: "bg-yellow-500/10 text-yellow-600" },
  premium: { label: "Premium", icon: Star, color: "bg-purple-500/10 text-purple-600" },
  guaranteed: { label: "Garanti", icon: Shield, color: "bg-green-500/10 text-green-600" },
};

const services = {
  tiktok: [
    { id: 1, name: "Followers TikTok", type: "followers", prices: [{ qty: 100, price: 1500 }, { qty: 500, price: 5000 }, { qty: 1000, price: 9000 }, { qty: 5000, price: 35000 }], popular: true, badges: ["fast", "guaranteed"], deliveryTime: "1-24h" },
    { id: 2, name: "Likes TikTok", type: "likes", prices: [{ qty: 100, price: 1000 }, { qty: 500, price: 4000 }, { qty: 1000, price: 6500 }, { qty: 5000, price: 25000 }], badges: ["fast"], deliveryTime: "1-12h" },
    { id: 3, name: "Vues TikTok", type: "views", prices: [{ qty: 1000, price: 750 }, { qty: 5000, price: 2500 }, { qty: 10000, price: 4500 }, { qty: 50000, price: 17500 }], badges: ["fast", "premium"], deliveryTime: "0-6h" },
    { id: 4, name: "Commentaires TikTok", type: "comments", prices: [{ qty: 10, price: 2500 }, { qty: 50, price: 10000 }, { qty: 100, price: 17500 }], badges: ["premium"], deliveryTime: "12-48h" },
    { id: 5, name: "Partages TikTok", type: "views", prices: [{ qty: 100, price: 2000 }, { qty: 500, price: 7500 }, { qty: 1000, price: 12500 }], badges: ["guaranteed"], deliveryTime: "6-24h" },
  ],
  instagram: [
    { id: 6, name: "Followers Instagram", type: "followers", prices: [{ qty: 100, price: 1750 }, { qty: 500, price: 6500 }, { qty: 1000, price: 11500 }, { qty: 5000, price: 45000 }], popular: true, badges: ["premium", "guaranteed"], deliveryTime: "1-24h" },
    { id: 7, name: "Likes Instagram", type: "likes", prices: [{ qty: 100, price: 1000 }, { qty: 500, price: 3500 }, { qty: 1000, price: 6000 }, { qty: 5000, price: 22500 }], badges: ["fast"], deliveryTime: "0-12h" },
    { id: 8, name: "Vues Reels", type: "views", prices: [{ qty: 1000, price: 1000 }, { qty: 5000, price: 3500 }, { qty: 10000, price: 6000 }, { qty: 50000, price: 22500 }], badges: ["fast", "premium"], deliveryTime: "0-6h" },
    { id: 9, name: "Vues Story", type: "views", prices: [{ qty: 100, price: 750 }, { qty: 500, price: 2500 }, { qty: 1000, price: 4500 }], badges: ["fast"], deliveryTime: "0-3h" },
    { id: 10, name: "Commentaires Instagram", type: "comments", prices: [{ qty: 10, price: 3000 }, { qty: 50, price: 12500 }, { qty: 100, price: 22500 }], badges: ["premium"], deliveryTime: "12-48h" },
  ],
  facebook: [
    { id: 11, name: "Likes Page", type: "likes", prices: [{ qty: 100, price: 2500 }, { qty: 500, price: 10000 }, { qty: 1000, price: 17500 }], popular: true, badges: ["guaranteed"], deliveryTime: "1-24h" },
    { id: 12, name: "Followers Page", type: "followers", prices: [{ qty: 100, price: 2000 }, { qty: 500, price: 7500 }, { qty: 1000, price: 13500 }], badges: ["fast", "guaranteed"], deliveryTime: "1-24h" },
    { id: 13, name: "Likes Posts", type: "likes", prices: [{ qty: 100, price: 1250 }, { qty: 500, price: 5000 }, { qty: 1000, price: 9000 }], badges: ["fast"], deliveryTime: "0-12h" },
    { id: 14, name: "Vues Vidéo", type: "views", prices: [{ qty: 1000, price: 1500 }, { qty: 5000, price: 6000 }, { qty: 10000, price: 10000 }], badges: ["fast", "premium"], deliveryTime: "0-6h" },
  ],
  youtube: [
    { id: 15, name: "Abonnés YouTube", type: "followers", prices: [{ qty: 100, price: 5000 }, { qty: 500, price: 20000 }, { qty: 1000, price: 35000 }], popular: true, badges: ["premium", "guaranteed"], deliveryTime: "24-72h" },
    { id: 16, name: "Vues YouTube", type: "views", prices: [{ qty: 1000, price: 2500 }, { qty: 5000, price: 10000 }, { qty: 10000, price: 17500 }], badges: ["fast", "guaranteed"], deliveryTime: "1-24h" },
    { id: 17, name: "Likes YouTube", type: "likes", prices: [{ qty: 100, price: 2000 }, { qty: 500, price: 7500 }, { qty: 1000, price: 12500 }], badges: ["fast"], deliveryTime: "1-12h" },
    { id: 18, name: "Commentaires YouTube", type: "comments", prices: [{ qty: 10, price: 5000 }, { qty: 50, price: 20000 }, { qty: 100, price: 35000 }], badges: ["premium"], deliveryTime: "24-72h" },
  ],
  twitter: [
    { id: 19, name: "Followers Twitter", type: "followers", prices: [{ qty: 100, price: 2000 }, { qty: 500, price: 7500 }, { qty: 1000, price: 13500 }], popular: true, badges: ["fast", "guaranteed"], deliveryTime: "1-24h" },
    { id: 20, name: "Likes Twitter", type: "likes", prices: [{ qty: 100, price: 1250 }, { qty: 500, price: 5000 }, { qty: 1000, price: 9000 }], badges: ["fast"], deliveryTime: "0-12h" },
    { id: 21, name: "Retweets", type: "views", prices: [{ qty: 100, price: 2000 }, { qty: 500, price: 7500 }, { qty: 1000, price: 13500 }], badges: ["guaranteed"], deliveryTime: "1-24h" },
  ],
  telegram: [
    { id: 22, name: "Membres Groupe", type: "followers", prices: [{ qty: 100, price: 2500 }, { qty: 500, price: 10000 }, { qty: 1000, price: 17500 }], popular: true, badges: ["premium", "guaranteed"], deliveryTime: "12-48h" },
    { id: 23, name: "Membres Canal", type: "followers", prices: [{ qty: 100, price: 2000 }, { qty: 500, price: 7500 }, { qty: 1000, price: 13500 }], badges: ["fast"], deliveryTime: "6-24h" },
    { id: 24, name: "Vues Posts", type: "views", prices: [{ qty: 1000, price: 1000 }, { qty: 5000, price: 4000 }, { qty: 10000, price: 7500 }], badges: ["fast", "premium"], deliveryTime: "0-6h" },
  ],
};

export default function Services() {
  const navigate = useNavigate();
  const [activePlatform, setActivePlatform] = useState("tiktok");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{ qty: number; price: number } | null>(null);
  const [accountUrl, setAccountUrl] = useState("");
  const [deliveryType, setDeliveryType] = useState<"standard" | "express">("standard");
  const [serviceFilter, setServiceFilter] = useState("all");

  const handleOrder = () => {
    if (!selectedService || !selectedPrice || !accountUrl) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    const totalPrice = deliveryType === "express" ? selectedPrice.price * 1.5 : selectedPrice.price;
    toast.success(`Commande de ${totalPrice.toLocaleString()} XAF créée avec succès !`);
    navigate("/orders");
  };

  const allServices = services[activePlatform as keyof typeof services] || [];
  const currentServices = serviceFilter === "all" 
    ? allServices 
    : allServices.filter(s => s.type === serviceFilter);
  
  const selectedServiceData = allServices.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Nos <span className="gradient-text">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez la plateforme et le service qui correspond à vos besoins.
              Livraison rapide garantie.
            </p>
          </div>

          {/* Platform Tabs */}
          <Tabs value={activePlatform} onValueChange={setActivePlatform} className="mb-6">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent">
              {platforms.map((platform) => (
                <TabsTrigger
                  key={platform.id}
                  value={platform.id}
                  className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-xl"
                >
                  <span className="mr-2">{platform.icon}</span>
                  {platform.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Filter */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {serviceTypes.map((type) => (
              <Button
                key={type.id}
                variant={serviceFilter === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setServiceFilter(type.id)}
                className={serviceFilter === type.id ? "gradient-primary" : ""}
              >
                {type.name}
              </Button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentServices.map((service) => {
              const platform = platforms.find(p => p.id === activePlatform);
              return (
                <Card
                  key={service.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedService === service.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setSelectedService(service.id);
                    setSelectedPrice(service.prices[0]);
                  }}
                >
                  {service.popular && (
                    <Badge className="absolute -top-2 -right-2 gradient-primary">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Populaire
                    </Badge>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{platform?.icon}</span>
                      {service.name}
                    </CardTitle>
                    {/* Quality Badges */}
                    <div className="flex gap-1 flex-wrap mt-2">
                      {service.badges?.map((badgeKey) => {
                        const badge = qualityBadges[badgeKey as keyof typeof qualityBadges];
                        return (
                          <Badge key={badgeKey} variant="secondary" className={badge.color}>
                            <badge.icon className="w-3 h-3 mr-1" />
                            {badge.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.prices.map((priceOption) => (
                        <button
                          key={priceOption.qty}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service.id);
                            setSelectedPrice(priceOption);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                            selectedService === service.id &&
                            selectedPrice?.qty === priceOption.qty
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="font-medium">
                            {priceOption.qty.toLocaleString()}
                          </span>
                          <span className="font-bold text-primary">
                            {priceOption.price.toLocaleString()} XAF
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        <span>{service.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Garantie</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Form */}
          {selectedService && selectedPrice && selectedServiceData && (
            <Card className="max-w-xl mx-auto border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Aperçu de la commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{platforms.find(p => p.id === activePlatform)?.icon}</span>
                    <div>
                      <p className="font-semibold">{selectedServiceData.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPrice.qty.toLocaleString()} unités
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {selectedServiceData.badges?.map((badgeKey) => {
                      const badge = qualityBadges[badgeKey as keyof typeof qualityBadges];
                      return (
                        <Badge key={badgeKey} variant="secondary" className={badge.color}>
                          <badge.icon className="w-3 h-3 mr-1" />
                          {badge.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Lien de votre profil / publication
                  </label>
                  <Input
                    placeholder="https://..."
                    value={accountUrl}
                    onChange={(e) => setAccountUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Option de livraison
                  </label>
                  <Select value={deliveryType} onValueChange={(v: "standard" | "express") => setDeliveryType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Standard - {selectedServiceData.deliveryTime}
                        </div>
                      </SelectItem>
                      <SelectItem value="express">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          Express (+50%) - Livraison prioritaire
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{selectedPrice.price.toLocaleString()} XAF</span>
                  </div>
                  {deliveryType === "express" && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Express (+50%)</span>
                      <span>{(selectedPrice.price * 0.5).toLocaleString()} XAF</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {(deliveryType === "express" ? selectedPrice.price * 1.5 : selectedPrice.price).toLocaleString()} XAF
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="w-4 h-4" />
                  <span>Livraison estimée : {selectedServiceData.deliveryTime}</span>
                </div>

                <Button onClick={handleOrder} className="w-full gradient-primary" size="lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Commander maintenant
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
