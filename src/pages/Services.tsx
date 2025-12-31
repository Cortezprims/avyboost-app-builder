import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Check, Zap } from "lucide-react";
import { toast } from "sonner";

const platforms = [
  { id: "tiktok", name: "TikTok", icon: "📱" },
  { id: "instagram", name: "Instagram", icon: "📸" },
  { id: "facebook", name: "Facebook", icon: "👍" },
  { id: "youtube", name: "YouTube", icon: "🎬" },
  { id: "twitter", name: "Twitter/X", icon: "🐦" },
  { id: "telegram", name: "Telegram", icon: "✈️" },
];

const services = {
  tiktok: [
    { id: 1, name: "Followers TikTok", prices: [{ qty: 100, price: 2.99 }, { qty: 500, price: 9.99 }, { qty: 1000, price: 17.99 }, { qty: 5000, price: 69.99 }], popular: true },
    { id: 2, name: "Likes TikTok", prices: [{ qty: 100, price: 1.99 }, { qty: 500, price: 7.99 }, { qty: 1000, price: 12.99 }, { qty: 5000, price: 49.99 }] },
    { id: 3, name: "Vues TikTok", prices: [{ qty: 1000, price: 1.49 }, { qty: 5000, price: 4.99 }, { qty: 10000, price: 8.99 }, { qty: 50000, price: 34.99 }] },
    { id: 4, name: "Commentaires TikTok", prices: [{ qty: 10, price: 4.99 }, { qty: 50, price: 19.99 }, { qty: 100, price: 34.99 }] },
    { id: 5, name: "Partages TikTok", prices: [{ qty: 100, price: 3.99 }, { qty: 500, price: 14.99 }, { qty: 1000, price: 24.99 }] },
  ],
  instagram: [
    { id: 6, name: "Followers Instagram", prices: [{ qty: 100, price: 3.49 }, { qty: 500, price: 12.99 }, { qty: 1000, price: 22.99 }, { qty: 5000, price: 89.99 }], popular: true },
    { id: 7, name: "Likes Instagram", prices: [{ qty: 100, price: 1.99 }, { qty: 500, price: 6.99 }, { qty: 1000, price: 11.99 }, { qty: 5000, price: 44.99 }] },
    { id: 8, name: "Vues Reels", prices: [{ qty: 1000, price: 1.99 }, { qty: 5000, price: 6.99 }, { qty: 10000, price: 11.99 }, { qty: 50000, price: 44.99 }] },
    { id: 9, name: "Vues Story", prices: [{ qty: 100, price: 1.49 }, { qty: 500, price: 4.99 }, { qty: 1000, price: 8.99 }] },
    { id: 10, name: "Commentaires Instagram", prices: [{ qty: 10, price: 5.99 }, { qty: 50, price: 24.99 }, { qty: 100, price: 44.99 }] },
  ],
  facebook: [
    { id: 11, name: "Likes Page", prices: [{ qty: 100, price: 4.99 }, { qty: 500, price: 19.99 }, { qty: 1000, price: 34.99 }], popular: true },
    { id: 12, name: "Followers Page", prices: [{ qty: 100, price: 3.99 }, { qty: 500, price: 14.99 }, { qty: 1000, price: 26.99 }] },
    { id: 13, name: "Likes Posts", prices: [{ qty: 100, price: 2.49 }, { qty: 500, price: 9.99 }, { qty: 1000, price: 17.99 }] },
    { id: 14, name: "Vues Vidéo", prices: [{ qty: 1000, price: 2.99 }, { qty: 5000, price: 11.99 }, { qty: 10000, price: 19.99 }] },
  ],
  youtube: [
    { id: 15, name: "Abonnés YouTube", prices: [{ qty: 100, price: 9.99 }, { qty: 500, price: 39.99 }, { qty: 1000, price: 69.99 }], popular: true },
    { id: 16, name: "Vues YouTube", prices: [{ qty: 1000, price: 4.99 }, { qty: 5000, price: 19.99 }, { qty: 10000, price: 34.99 }] },
    { id: 17, name: "Likes YouTube", prices: [{ qty: 100, price: 3.99 }, { qty: 500, price: 14.99 }, { qty: 1000, price: 24.99 }] },
    { id: 18, name: "Commentaires YouTube", prices: [{ qty: 10, price: 9.99 }, { qty: 50, price: 39.99 }, { qty: 100, price: 69.99 }] },
  ],
  twitter: [
    { id: 19, name: "Followers Twitter", prices: [{ qty: 100, price: 3.99 }, { qty: 500, price: 14.99 }, { qty: 1000, price: 26.99 }], popular: true },
    { id: 20, name: "Likes Twitter", prices: [{ qty: 100, price: 2.49 }, { qty: 500, price: 9.99 }, { qty: 1000, price: 17.99 }] },
    { id: 21, name: "Retweets", prices: [{ qty: 100, price: 3.99 }, { qty: 500, price: 14.99 }, { qty: 1000, price: 26.99 }] },
  ],
  telegram: [
    { id: 22, name: "Membres Groupe", prices: [{ qty: 100, price: 4.99 }, { qty: 500, price: 19.99 }, { qty: 1000, price: 34.99 }], popular: true },
    { id: 23, name: "Membres Canal", prices: [{ qty: 100, price: 3.99 }, { qty: 500, price: 14.99 }, { qty: 1000, price: 26.99 }] },
    { id: 24, name: "Vues Posts", prices: [{ qty: 1000, price: 1.99 }, { qty: 5000, price: 7.99 }, { qty: 10000, price: 14.99 }] },
  ],
};

export default function Services() {
  const [activePlatform, setActivePlatform] = useState("tiktok");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{ qty: number; price: number } | null>(null);
  const [accountUrl, setAccountUrl] = useState("");

  const handleAddToCart = () => {
    if (!selectedService || !selectedPrice || !accountUrl) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    toast.success("Service ajouté au panier !");
    setSelectedService(null);
    setSelectedPrice(null);
    setAccountUrl("");
  };

  const currentServices = services[activePlatform as keyof typeof services] || [];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Nos <span className="gradient-text">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez la plateforme et le service qui correspond à vos besoins.
              Livraison rapide garantie.
            </p>
          </div>

          {/* Platform Tabs */}
          <Tabs value={activePlatform} onValueChange={setActivePlatform} className="mb-8">
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

            {platforms.map((platform) => (
              <TabsContent key={platform.id} value={platform.id} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(services[platform.id as keyof typeof services] || []).map((service) => (
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
                          Populaire
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{platform.icon}</span>
                          {service.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
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
                                {priceOption.price.toFixed(2)}€
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Livraison progressive
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Garantie qualité
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary" />
                            Début sous 24h
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Order Form */}
          {selectedService && selectedPrice && (
            <Card className="max-w-lg mx-auto mt-8 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Finaliser la commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Service sélectionné</p>
                  <p className="font-semibold">
                    {currentServices.find((s) => s.id === selectedService)?.name} -{" "}
                    {selectedPrice.qty.toLocaleString()} unités
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prix</p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedPrice.price.toFixed(2)}€
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Lien de votre profil / publication
                  </label>
                  <Input
                    placeholder="https://..."
                    value={accountUrl}
                    onChange={(e) => setAccountUrl(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddToCart} className="w-full gradient-primary">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter au panier
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
