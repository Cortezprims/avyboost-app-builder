import { useEffect, useSyncExternalStore } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  setLiveRates,
  getLiveRatesVersion,
  subscribeLiveRates,
} from "@/lib/liveRates";

/**
 * Subscribes to `config/exoPrices` and pushes live ExoBooster rates into the
 * module-level cache used by `priceSync`. Mount ONCE at the app root.
 */
export function useLiveExoRatesSync() {
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "config", "exoPrices"),
      (snap) => {
        const data = snap.data() as { rates?: Record<string, number> } | undefined;
        if (!data?.rates) return;
        const parsed: Record<number, number> = {};
        for (const [k, v] of Object.entries(data.rates)) {
          const id = Number(k);
          const rate = Number(v);
          if (id && rate > 0) parsed[id] = rate;
        }
        setLiveRates(parsed);
      },
      (err) => console.warn("[liveRates] snapshot error", err),
    );
    return () => unsub();
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