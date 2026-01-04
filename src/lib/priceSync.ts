// Synchronisation des prix AVYboost avec ExoBooster
// Les tarifs ExoBooster sont en USD par 1000 unités
// Conversion en XAF avec marge de 25%

import { exoboosterMapping, ExoBoosterServiceInfo } from '@/data/exoboosterMapping';

// Taux de change USD vers XAF (à mettre à jour régulièrement)
const USD_TO_XAF_RATE = 615; // Environ 615 XAF = 1 USD

// Marge AVYboost
const MARGIN_PERCENTAGE = 0.25; // 25%

export interface CalculatedPrice {
  qty: number;
  price: number;
  quality?: "standard" | "premium" | "moyenne" | "haute";
  label?: string;
}

/**
 * Calcule le prix AVYboost en XAF à partir du taux ExoBooster
 * @param exoRateUSD - Taux ExoBooster en USD pour 1000 unités
 * @param quantity - Quantité souhaitée
 * @returns Prix en XAF arrondi
 */
export function calculateAvyPrice(exoRateUSD: number, quantity: number): number {
  // Prix de base en USD pour la quantité
  const basePriceUSD = (exoRateUSD / 1000) * quantity;
  
  // Conversion en XAF
  const basePriceXAF = basePriceUSD * USD_TO_XAF_RATE;
  
  // Ajout de la marge de 25%
  const finalPrice = basePriceXAF * (1 + MARGIN_PERCENTAGE);
  
  // Arrondi au multiple de 5 le plus proche pour des prix propres
  return Math.ceil(finalPrice / 5) * 5;
}

/**
 * Génère les prix pour un service AVYboost basé sur ExoBooster
 * @param platform - Plateforme (tiktok, instagram, etc.)
 * @param avyServiceId - ID du service AVYboost
 * @param quantities - Liste des quantités pour les paliers
 * @param quality - Qualité du service
 * @returns Liste des prix calculés
 */
export function generateServicePrices(
  platform: string,
  avyServiceId: number,
  quantities: number[],
  quality?: "standard" | "premium" | "moyenne" | "haute"
): CalculatedPrice[] {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return [];
  
  const exoInfo = platformMapping[avyServiceId];
  if (!exoInfo) return [];
  
  return quantities.map(qty => ({
    qty,
    price: calculateAvyPrice(exoInfo.rate, qty),
    ...(quality && { quality })
  }));
}

/**
 * Obtient le prix unitaire (pour 1000 unités) en XAF avec marge
 * @param platform - Plateforme
 * @param avyServiceId - ID du service AVYboost
 * @returns Prix pour 1000 unités en XAF ou null si non trouvé
 */
export function getUnitPrice(platform: string, avyServiceId: number): number | null {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return null;
  
  const exoInfo = platformMapping[avyServiceId];
  if (!exoInfo) return null;
  
  return calculateAvyPrice(exoInfo.rate, 1000);
}

/**
 * Obtient les informations de tarification complètes pour un service
 */
export function getPricingInfo(platform: string, avyServiceId: number): {
  exoInfo: ExoBoosterServiceInfo | null;
  unitPriceXAF: number | null;
  marginPercentage: number;
  exchangeRate: number;
} {
  const platformMapping = exoboosterMapping[platform];
  const exoInfo = platformMapping?.[avyServiceId] || null;
  
  return {
    exoInfo,
    unitPriceXAF: exoInfo ? calculateAvyPrice(exoInfo.rate, 1000) : null,
    marginPercentage: MARGIN_PERCENTAGE * 100,
    exchangeRate: USD_TO_XAF_RATE
  };
}

/**
 * Calcule le prix dynamique pour une quantité donnée
 * @param platform - Plateforme
 * @param avyServiceId - ID du service AVYboost
 * @param quantity - Quantité souhaitée
 * @returns Prix en XAF ou null si service non trouvé
 */
export function calculateDynamicPrice(
  platform: string,
  avyServiceId: number,
  quantity: number
): number | null {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return null;
  
  const exoInfo = platformMapping[avyServiceId];
  if (!exoInfo) return null;
  
  return calculateAvyPrice(exoInfo.rate, quantity);
}

/**
 * Récupère tous les prix synchronisés pour une plateforme
 */
export function getSyncedPricesForPlatform(platform: string): Record<number, CalculatedPrice[]> {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return {};
  
  const result: Record<number, CalculatedPrice[]> = {};
  
  for (const [avyId, exoInfo] of Object.entries(platformMapping)) {
    const serviceId = parseInt(avyId);
    // Quantités standard pour chaque service
    const quantities = [100, 500, 1000, 5000, 10000];
    
    result[serviceId] = quantities.map(qty => ({
      qty,
      price: calculateAvyPrice(exoInfo.rate, qty)
    }));
  }
  
  return result;
}

/**
 * Configuration des prix (peut être modifiée dynamiquement)
 */
export const pricingConfig = {
  USD_TO_XAF_RATE,
  MARGIN_PERCENTAGE,
  
  // Méthode pour mettre à jour le taux de change
  setExchangeRate: (rate: number) => {
    (pricingConfig as { USD_TO_XAF_RATE: number }).USD_TO_XAF_RATE = rate;
  },
  
  // Méthode pour mettre à jour la marge
  setMarginPercentage: (margin: number) => {
    (pricingConfig as { MARGIN_PERCENTAGE: number }).MARGIN_PERCENTAGE = margin;
  }
};
