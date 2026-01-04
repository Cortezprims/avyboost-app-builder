import { useMemo } from 'react';
import { services, Service, ServicePrice, PlatformServices } from '@/data/services';
import { exoboosterMapping } from '@/data/exoboosterMapping';
import { calculateAvyPrice } from '@/lib/priceSync';

/**
 * Hook qui retourne les services avec les prix synchronisés
 * basés sur les tarifs ExoBooster + marge de 25%
 */
export function useSyncedServices(): PlatformServices {
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
          price: calculateAvyPrice(exoInfo.rate, priceItem.qty)
        }));
        
        return {
          ...service,
          prices: syncedPrices
        };
      });
    }
    
    return syncedServices;
  }, []);
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
  return useMemo(() => {
    const platformMapping = exoboosterMapping[platform];
    const exoInfo = platformMapping?.[serviceId];
    
    if (!exoInfo) return null;
    
    return calculateAvyPrice(exoInfo.rate, quantity);
  }, [platform, serviceId, quantity]);
}
