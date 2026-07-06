import { normalizeRatesMap } from "@/data/exoboosterSnapshotRates";
import { invokeAuthedFn } from "@/lib/invokeFn";
import { setLiveRates } from "@/lib/liveRates";

const CACHE_KEY = "avyboost.exoPrices.v1";

type CachedExoPrices = {
  rates: Record<number, number>;
  updatedAt: string;
  count: number;
};

type ExoPricesResponse = {
  success?: boolean;
  data?: unknown;
  count?: number;
  timestamp?: string;
};

export function readCachedExoPrices(): CachedExoPrices | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { rates?: unknown; updatedAt?: unknown; count?: unknown };
    const rates = normalizeRatesMap(parsed.rates);
    if (!Object.keys(rates).length || typeof parsed.updatedAt !== "string") return null;
    return {
      rates,
      updatedAt: parsed.updatedAt,
      count: typeof parsed.count === "number" ? parsed.count : Object.keys(rates).length,
    };
  } catch {
    return null;
  }
}

export function writeCachedExoPrices(rates: Record<number, number>, updatedAt = new Date().toISOString()) {
  if (typeof window === "undefined") return;
  const normalized = normalizeRatesMap(rates);
  const payload: CachedExoPrices = {
    rates: normalized,
    updatedAt,
    count: Object.keys(normalized).length,
  };
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

export function isFreshExoCache(cache: CachedExoPrices | null, maxAgeMs = 6 * 60 * 60 * 1000) {
  if (!cache) return false;
  const time = Date.parse(cache.updatedAt);
  return Number.isFinite(time) && Date.now() - time < maxAgeMs;
}

export async function refreshExoPricesFromBackend() {
  const { data, error } = await invokeAuthedFn<ExoPricesResponse>("exobooster-prices", {});
  if (error) throw new Error(error.message);

  const rates = normalizeRatesMap(data?.data);
  if (!data?.success || !Object.keys(rates).length) {
    throw new Error("Réponse ExoBooster invalide");
  }

  const updatedAt = data.timestamp || new Date().toISOString();
  setLiveRates(rates);
  writeCachedExoPrices(rates, updatedAt);

  return {
    rates,
    count: data.count || Object.keys(rates).length,
    updatedAt,
  };
}