import { useMemo } from 'react';
import { services, Service, ServicePrice, PlatformServices } from '@/data/services';
import { exoboosterMapping } from '@/data/exoboosterMapping';
import { calculateAvyPrice } from '@/lib/priceSync';
import { resolveRate } from '@/lib/liveRates';
import { useLiveRatesVersion } from '@/hooks/useLiveExoRates';

/**
 * Hook qui retourne les services avec les prix synchronisés
 * basés sur les tarifs ExoBooster + marge de 25%
 */
export function useSyncedServices(): PlatformServices {
  const version = useLiveRatesVersion();
  return useMemo(() => {
    const syncedServices: PlatformServices = {};
    
    for (const [platform, platformServices] of Object.entries(services)) {
      syncedServices[platform] = platformServices.map(service => {
        const platformMapping = exoboosterMapping[platform];
        const exoInfo = platformMapping?.[service.id];
        
        if (!exoInfo) {
          // Si pas de mapping, garder les prix originaux
          return service;
        }
        
        // Recalculer les prix avec le taux ExoBooster + marge
        const syncedPrices: ServicePrice[] = service.prices.map(priceItem => ({
          ...priceItem,
          price: calculateAvyPrice(resolveRate(exoInfo), priceItem.qty)
        }));
        
        return {
          ...service,
          prices: syncedPrices
        };
      });
    }
    
    return syncedServices;
  }, [version]);
}

/**
 * Hook qui retourne un seul service avec prix synchronisés
 */
export function useSyncedService(platform: string, serviceId: number): Service | null {
  const syncedServices = useSyncedServices();
  
  return useMemo(() => {
    const platformServices = syncedServices[platform];
    if (!platformServices) return null;
    
    return platformServices.find(s => s.id === serviceId) || null;
  }, [syncedServices, platform, serviceId]);
}

/**
 * Calcule le prix dynamique pour une quantité personnalisée
 */
export function useDynamicPrice(platform: string, serviceId: number, quantity: number): number | null {
  const version = useLiveRatesVersion();
  return useMemo(() => {
    // Guard against invalid inputs to prevent crashes
    if (!platform || !serviceId || serviceId <= 0 || quantity <= 0) {
      return null;
    }
    
    const platformMapping = exoboosterMapping[platform];
    if (!platformMapping) return null;
    
    const exoInfo = platformMapping[serviceId];
    if (!exoInfo || typeof exoInfo.rate !== 'number') return null;
    
    return calculateAvyPrice(resolveRate(exoInfo), quantity);
  }, [platform, serviceId, quantity, version]);
}
