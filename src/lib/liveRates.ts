// Runtime cache of ExoBooster rates (USD per 1000), keyed by service id.
// It starts with the latest admin-provided snapshot, then live API values are
// merged in when the backend refresh succeeds.

import { exoboosterSnapshotRates } from "@/data/exoboosterSnapshotRates";

let liveRates: Record<number, number> = { ...exoboosterSnapshotRates };
let version = 0;
const listeners = new Set<() => void>();

export function setLiveRates(rates: Record<number, number>) {
  liveRates = { ...exoboosterSnapshotRates, ...(rates || {}) };
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