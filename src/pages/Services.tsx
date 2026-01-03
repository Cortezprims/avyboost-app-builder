import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useOrders, useWallet } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { useExoBooster } from "@/hooks/useExoBooster";
import { platformConfig, PlatformKey } from "@/components/icons/SocialIcons";
import { services, serviceTypes, qualityBadges } from "@/data/services";
import { getExoBoosterServiceId, validateQuantity } from "@/data/exoboosterMapping";
import { ShoppingCart, Zap, Clock, Shield, Star, Timer, Sparkles, ArrowLeft, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

const platforms: PlatformKey[] = ["tiktok", "instagram", "facebook", "youtube", "twitter", "telegram", "whatsapp"];

export default function Services() {
  const navigate = useNavigate();
  const { platform: urlPlatform } = useParams();
  const { user } = useAuth();
  const { balance } = useWallet();
  const { createOrder } = useOrders();
  const { createOrder: createExoBoosterOrder, isLoading: exoLoading, error: exoError } = useExoBooster();
  
  const [activePlatform, setActivePlatform] = useState<PlatformKey>((urlPlatform as PlatformKey) || "tiktok");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{ qty: number; price: number } | null>(null);
  const [accountUrl, setAccountUrl] = useState("");
  const [deliveryType, setDeliveryType] = useState<"standard" | "express">("standard");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [isOrdering, setIsOrdering] = useState(false);

  const handleOrder = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter");
      navigate("/auth");
      return;
    }
    
    if (!selectedService || !selectedPrice || !accountUrl) {
      toast.error("Remplissez tous les champs");
      return;
    }

    const totalPrice = deliveryType === "express" ? selectedPrice.price * 1.5 : selectedPrice.price;
    
    if (balance < totalPrice) {
      toast.error("Solde insuffisant. Rechargez votre portefeuille.");
      navigate("/wallet");
      return;
    }

    setIsOrdering(true);
    try {
      // Get the ExoBooster service ID from mapping
      const exoServiceId = getExoBoosterServiceId(activePlatform, selectedService);
      
      if (!exoServiceId) {
        throw new Error("Service non disponible via l'API");
      }

      // Validate quantity against ExoBooster limits
      const validation = validateQuantity(activePlatform, selectedService, selectedPrice.qty);
      if (!validation.valid) {
        throw new Error(validation.message || "Quantité invalide");
      }

      // Call ExoBooster API to create the order with the correct service ID
      const exoResponse = await createExoBoosterOrder(
        exoServiceId.toString(),
        accountUrl,
        selectedPrice.qty
      );

      if (!exoResponse) {
        throw new Error(exoError || "Erreur lors de la commande ExoBooster");
      }

      // Save order to Firestore with ExoBooster order ID
      await createOrder({
        service: `${selectedServiceData?.name} ${currentPlatformConfig.name}`,
        platform: activePlatform,
        quantity: selectedPrice.qty,
        targetUrl: accountUrl,
        amount: totalPrice,
        deliveryType,
        estimatedTime: selectedServiceData?.deliveryTime || "1-24h",
        exoboosterOrderId: exoResponse.order,
      });
      
      toast.success(`Commande créée avec succès ! ID: ${exoResponse.order}`);
      navigate("/orders");
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.message || "Erreur lors de la commande");
    } finally {
      setIsOrdering(false);
    }
  };

  const allServices = services[activePlatform] || [];
  const currentServices = serviceFilter === "all" 
    ? allServices 
    : allServices.filter(s => s.type === serviceFilter);
  
  const selectedServiceData = allServices.find(s => s.id === selectedService);
  const currentPlatformConfig = platformConfig[activePlatform];
  const PlatformIcon = currentPlatformConfig.icon;
  const totalPrice = selectedPrice ? (deliveryType === "express" ? selectedPrice.price * 1.5 : selectedPrice.price) : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="font-display font-bold text-lg">Services</h1>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <Link to="/wallet">
                  <Badge variant="secondary" className="gap-1">
                    <Wallet className="w-3 h-3" />
                    {balance.toLocaleString()} XAF
                  </Badge>
                </Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Platform Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {platforms.map((platformId) => {
            const config = platformConfig[platformId];
            const Icon = config.icon;
            return (
              <button
                key={platformId}
                onClick={() => {
                  setActivePlatform(platformId);
                  setSelectedService(null);
                  setSelectedPrice(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activePlatform === platformId
                    ? `${config.color} ${config.textColor}`
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{config.name}</span>
              </button>
            );
          })}
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
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
        <div className="space-y-3">
          {currentServices.map((service) => (
            <Card
              key={service.id}
              className={`relative cursor-pointer transition-all ${
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
                <Badge className="absolute -top-2 -right-2 gradient-primary text-[10px]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Populaire
                </Badge>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl ${currentPlatformConfig.color} flex items-center justify-center`}>
                      <PlatformIcon className={currentPlatformConfig.textColor} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <div className="flex gap-1 mt-1">
                        {service.badges?.map((badgeKey) => {
                          const badge = qualityBadges[badgeKey as keyof typeof qualityBadges];
                          return (
                            <Badge key={badgeKey} variant="secondary" className={`${badge.color} text-[10px] px-2`}>
                              <badge.icon className="w-3 h-3 mr-1" />
                              {badge.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Timer className="w-3 h-3" />
                    {service.deliveryTime}
                  </div>
                </div>

                {/* Prices */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {service.prices.map((priceOption) => (
                    <button
                      key={priceOption.qty}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(service.id);
                        setSelectedPrice(priceOption);
                      }}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg border text-sm transition-all ${
                        selectedService === service.id && selectedPrice?.qty === priceOption.qty
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="block font-medium">{priceOption.qty.toLocaleString()}</span>
                      <span className="text-primary font-bold">{priceOption.price.toLocaleString()} XAF</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Form */}
        {selectedService && selectedPrice && selectedServiceData && (
          <Card className="border-primary sticky bottom-20 shadow-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${currentPlatformConfig.color} flex items-center justify-center`}>
                    <PlatformIcon className={currentPlatformConfig.textColor} size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedServiceData.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedPrice.qty.toLocaleString()} unités</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">
                  {totalPrice.toLocaleString()} XAF
                </p>
              </div>

              <Input
                placeholder="Lien de votre profil / publication"
                value={accountUrl}
                onChange={(e) => setAccountUrl(e.target.value)}
              />

              <div className="flex gap-2">
                <Button
                  variant={deliveryType === "standard" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${deliveryType === "standard" ? "gradient-primary" : ""}`}
                  onClick={() => setDeliveryType("standard")}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Standard
                </Button>
                <Button
                  variant={deliveryType === "express" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${deliveryType === "express" ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                  onClick={() => setDeliveryType("express")}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Express +50%
                </Button>
              </div>

              {user && balance < totalPrice && (
                <p className="text-sm text-destructive text-center">
                  Solde insuffisant ({balance.toLocaleString()} XAF)
                </p>
              )}

              <Button
                size="lg"
                className="w-full gradient-primary glow"
                onClick={handleOrder}
                disabled={!accountUrl || isOrdering || (user && balance < totalPrice)}
              >
                {isOrdering ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5 mr-2" />
                )}
                {user ? "Commander maintenant" : "Se connecter pour commander"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
