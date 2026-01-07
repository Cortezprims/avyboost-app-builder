import { useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useOrders, useWallet } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { useExoBooster } from "@/hooks/useExoBooster";
import { useSyncedServices, useDynamicPrice } from "@/hooks/useSyncedPrices";
import { platformConfig, PlatformKey } from "@/components/icons/SocialIcons";
import { serviceTypes, qualityBadges } from "@/data/services";
import { getExoBoosterServiceId, validateQuantity, getExoBoosterServiceInfo } from "@/data/exoboosterMapping";
import { ShoppingCart, Zap, Clock, Shield, Star, Timer, Sparkles, ArrowLeft, Loader2, Wallet, Info, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Réactions disponibles par plateforme
const platformReactions: Record<string, { emoji: string; label: string }[]> = {
  facebook: [
    { emoji: "👍", label: "J'aime" },
    { emoji: "❤️", label: "J'adore" },
    { emoji: "😂", label: "Haha" },
    { emoji: "😮", label: "Wouah" },
    { emoji: "😢", label: "Triste" },
    { emoji: "😡", label: "Grrr" },
  ],
  instagram: [
    { emoji: "❤️", label: "J'aime" },
  ],
  youtube: [
    { emoji: "👍", label: "J'aime" },
    { emoji: "👎", label: "Je n'aime pas" },
  ],
  tiktok: [
    { emoji: "❤️", label: "J'aime" },
  ],
  twitter: [
    { emoji: "❤️", label: "J'aime" },
  ],
  telegram: [
    { emoji: "👍", label: "Pouce" },
    { emoji: "❤️", label: "Coeur" },
    { emoji: "🔥", label: "Feu" },
    { emoji: "🎉", label: "Fête" },
    { emoji: "😂", label: "MDR" },
  ],
  whatsapp: [
    { emoji: "👍", label: "Pouce" },
    { emoji: "❤️", label: "Coeur" },
    { emoji: "😂", label: "MDR" },
  ],
};

// Notes par type de service
const getServiceNotes = (platform: string, serviceType: string): string[] => {
  const notes: string[] = [];
  
  // Notes communes
  notes.push(`Assurez-vous que le compte/publication ${platform} n'est pas privé !`);
  
  if (serviceType === "comments") {
    notes.push("Assurez-vous qu'aucun des commentaires ne comporte de \"@\" ou \"#\"");
    notes.push("Si vous avez déjà acheté des commentaires et que vous souhaitez en acheter à nouveau pour la même publication, assurez-vous que votre commande précédente est déjà terminée !");
  }
  
  notes.push("Une qualité élevée signifie une garantie plus longue, des comptes/engagements d'apparence plus réelle et moins de chutes");
  
  return notes;
};

const platforms: PlatformKey[] = ["tiktok", "instagram", "facebook", "youtube", "twitter", "telegram", "whatsapp"];

export default function Services() {
  const navigate = useNavigate();
  const { platform: urlPlatform } = useParams();
  const { user } = useAuth();
  const { balance, refreshBalance } = useWallet();
  const { createOrder } = useOrders();
  const { createOrder: createExoBoosterOrder, isLoading: exoLoading, error: exoError } = useExoBooster();
  
  const [activePlatform, setActivePlatform] = useState<PlatformKey>((urlPlatform as PlatformKey) || "tiktok");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [customQuantity, setCustomQuantity] = useState<number | null>(null);
  const [accountUrl, setAccountUrl] = useState("");
  const [deliveryType, setDeliveryType] = useState<"standard" | "express">("standard");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [isOrdering, setIsOrdering] = useState(false);
  const [comments, setComments] = useState("");
  const [selectedReaction, setSelectedReaction] = useState<string>("");

  // Get ExoBooster service info for min/max limits
  const serviceInfo = selectedService ? getExoBoosterServiceInfo(activePlatform, selectedService) : null;
  
  // Calculate dynamic price based on custom quantity
  const dynamicPrice = useDynamicPrice(activePlatform, selectedService || 0, customQuantity || 0);
  
  // Computed selected price based on custom quantity
  const selectedPrice = useMemo(() => {
    if (!customQuantity || !dynamicPrice) return null;
    return { qty: customQuantity, price: dynamicPrice };
  }, [customQuantity, dynamicPrice]);

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
      let orderError: string | null = null;
      const exoResponse = await createExoBoosterOrder(
        exoServiceId.toString(),
        accountUrl,
        selectedPrice.qty
      ).catch((err) => {
        orderError = err?.message || "Erreur lors de la commande";
        return null;
      });

      if (!exoResponse) {
        // Check for specific error messages
        const errorMsg = orderError || exoError || "Erreur lors de la commande ExoBooster";
        if (errorMsg.toLowerCase().includes("not enough funds") || errorMsg.toLowerCase().includes("balance")) {
          throw new Error("Solde ExoBooster insuffisant. Veuillez contacter le support.");
        }
        throw new Error(errorMsg);
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

  // Utiliser les services avec les prix synchronisés (ExoBooster + 25% marge)
  const syncedServices = useSyncedServices();
  const allServices = syncedServices[activePlatform] || [];
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
                <div className="flex items-center gap-1">
                  <Link to="/wallet">
                    <Badge variant="secondary" className="gap-1">
                      <Wallet className="w-3 h-3" />
                      {balance.toLocaleString()} XAF
                    </Badge>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      refreshBalance();
                      toast.success("Solde actualisé");
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
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
                  setCustomQuantity(null);
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
          {currentServices.map((service) => {
            const svcInfo = getExoBoosterServiceInfo(activePlatform, service.id);
            return (
              <Card
                key={service.id}
                className={`relative cursor-pointer transition-all ${
                  selectedService === service.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => {
                  setSelectedService(service.id);
                  // Set default quantity to minimum
                  if (svcInfo) {
                    setCustomQuantity(svcInfo.min);
                  } else {
                    setCustomQuantity(service.prices[0]?.qty || 100);
                  }
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

                  {/* Price info & min/max */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      {svcInfo ? (
                        <span>Min: {svcInfo.min.toLocaleString()} - Max: {svcInfo.max.toLocaleString()}</span>
                      ) : (
                        <span>À partir de {service.prices[0]?.price.toLocaleString()} XAF</span>
                      )}
                    </div>
                    <div className="text-primary font-bold">
                      {service.prices[0]?.price.toLocaleString()} XAF / {service.prices[0]?.qty.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Form */}
        {selectedService && selectedServiceData && (
          <Card className="border-primary sticky bottom-20 shadow-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${currentPlatformConfig.color} flex items-center justify-center`}>
                    <PlatformIcon className={currentPlatformConfig.textColor} size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedServiceData.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customQuantity ? customQuantity.toLocaleString() : 0} unités
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">
                  {totalPrice.toLocaleString()} XAF
                </p>
              </div>

              {/* Custom Quantity Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre d'unités:</label>
                <Input
                  type="number"
                  placeholder={`Ex: ${serviceInfo?.min || 100}`}
                  value={customQuantity || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setCustomQuantity(val);
                  }}
                  min={serviceInfo?.min || 1}
                  max={serviceInfo?.max || 1000000}
                />
                {serviceInfo && (
                  <p className="text-xs text-muted-foreground">
                    Min: {serviceInfo.min.toLocaleString()} - Max: {serviceInfo.max.toLocaleString()}
                    {customQuantity && customQuantity < serviceInfo.min && (
                      <span className="text-destructive ml-2">⚠️ Quantité insuffisante</span>
                    )}
                    {customQuantity && customQuantity > serviceInfo.max && (
                      <span className="text-destructive ml-2">⚠️ Quantité trop élevée</span>
                    )}
                  </p>
                )}
              </div>

              <Input
                placeholder="Lien de votre profil / publication"
                value={accountUrl}
                onChange={(e) => setAccountUrl(e.target.value)}
              />

              {/* Champ commentaires pour les services de type comments */}
              {selectedServiceData.type === "comments" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Commentaires:
                    <span className="text-muted-foreground font-normal ml-1">
                      (Séparez chaque commentaire en passant à une nouvelle ligne)
                    </span>
                  </label>
                  <Textarea
                    placeholder="Entrez vos commentaires ici...&#10;Un commentaire par ligne"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Min: {customQuantity || serviceInfo?.min || 1} commentaires
                  </p>
                </div>
              )}

              {/* Sélecteur de réactions pour les services de type reactions/likes */}
              {selectedServiceData.type === "reactions" && platformReactions[activePlatform] && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de réaction:</label>
                  <div className="flex gap-2 flex-wrap">
                    {platformReactions[activePlatform].map((reaction) => (
                      <button
                        key={reaction.emoji}
                        onClick={() => setSelectedReaction(reaction.emoji)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          selectedReaction === reaction.emoji
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-2xl">{reaction.emoji}</span>
                        <span className="text-sm">{reaction.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                disabled={!accountUrl || isOrdering || !customQuantity || !selectedPrice || (user && balance < totalPrice) || (serviceInfo && (customQuantity < serviceInfo.min || customQuantity > serviceInfo.max))}
              >
                {isOrdering ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5 mr-2" />
                )}
                {user ? "Commander maintenant" : "Se connecter pour commander"}
              </Button>

              {/* Bulle de notes */}
              <div className="mt-4 p-4 rounded-xl bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-pink-700 dark:text-pink-300">Notes:</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-pink-700 dark:text-pink-300">
                  {getServiceNotes(currentPlatformConfig.name, selectedServiceData.type).map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
