import { useEffect, useSyncExternalStore } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  setLiveRates,
  getLiveRatesVersion,
  subscribeLiveRates,
} from "@/lib/liveRates";
import {
  isFreshExoCache,
  readCachedExoPrices,
  refreshExoPricesFromBackend,
} from "@/lib/exoPriceCache";

/**
 * Loads ExoBooster rates into the module-level cache used by `priceSync`.
 * Firestore rules are no longer required: rates are read from a local cache,
 * then refreshed through the secured backend once an authenticated user exists.
 */
export function useLiveExoRatesSync() {
  useEffect(() => {
    let cancelled = false;
    const cached = readCachedExoPrices();
    if (cached) setLiveRates(cached.rates);

    const refreshIfNeeded = async () => {
      if (cancelled || isFreshExoCache(readCachedExoPrices())) return;
      try {
        await refreshExoPricesFromBackend();
      } catch (err) {
        console.warn("[liveRates] backend refresh error", err);
      }
    };

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) void refreshIfNeeded();
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);
}

/** Re-renders whenever live rates change. Returns the version counter. */
export function useLiveRatesVersion() {
  return useSyncExternalStore(
    (cb) => subscribeLiveRates(cb),
    () => getLiveRatesVersion(),
    () => 0,
  );
}