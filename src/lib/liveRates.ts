// Runtime cache of live ExoBooster rates (USD per 1000).
// Populated from Firestore `config/exoPrices` by `useLiveExoRatesSync`.
// Keyed by ExoBooster service id.

let liveRates: Record<number, number> = {};
let version = 0;
const listeners = new Set<() => void>();

export function setLiveRates(rates: Record<number, number>) {
  liveRates = rates || {};
  version += 1;
  listeners.forEach((l) => l());
}

export function getLiveRate(exoId: number | undefined): number | null {
  if (!exoId) return null;
  const r = liveRates[exoId];
  return typeof r === "number" && r > 0 ? r : null;
}

export function resolveRate(exoInfo: { exoId: number; rate: number } | null | undefined): number {
  if (!exoInfo) return 0;
  return getLiveRate(exoInfo.exoId) ?? exoInfo.rate;
}

export function getLiveRatesVersion() {
  return version;
}

export function subscribeLiveRates(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getAllLiveRates() {
  return { ...liveRates };
}