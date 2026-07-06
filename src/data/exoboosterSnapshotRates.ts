// Tarifs ExoBooster relevés depuis les captures fournies par l'administrateur.
// Les montants sont en USD pour 1000 unités, avant conversion XAF et marge AVYboost.

export const exoboosterSnapshotRates: Record<number, number> = {
  // TikTok
  3036: 3.5,
  3037: 5,
  3048: 0.2,
  3049: 0.35,
  3047: 0.06,
  3043: 0.09,
  3051: 0.01,
  3054: 0.1,
  3154: 3,
  3101: 55,
  3102: 0.2,

  // Instagram
  3106: 2,
  3107: 3,
  2997: 0.2,
  2998: 0.4,
  3108: 0.004,
  3109: 0.015,
  3156: 0.2,
  3157: 0.4,
  3014: 3,
  3015: 13,
  3017: 0.21,
  3119: 1.72,

  // Facebook
  3123: 2,
  3124: 3,
  3125: 2,
  3126: 3,
  3129: 0.3,
  3130: 0.4,
  3131: 0.42,
  3132: 0.42,
  3133: 0.42,
  3134: 0.42,
  3135: 0.42,
  2975: 1,
  2932: 1.2,
  3136: 1.8,
  3137: 0.09,
  3138: 0.15,
  3139: 3,
  3155: 91,
  3140: 104,
  3141: 56,

  // Telegram
  3143: 2,
  3144: 3,
  2801: 0.02,
  2804: 0.004,
  2733: 0.03,
  2734: 0.03,
  2735: 0.03,
  2736: 0.03,
  2737: 0.03,
  2738: 0.03,

  // YouTube
  3056: 32,
  3058: 40,
  3061: 1,
  3062: 1.4,
  3080: 3,
  3149: 6,
  3151: 10,

  // WhatsApp / Potato Chat
  2880: 2.8,
  2878: 4.5,
  2879: 4.5,
  2891: 1.4,
  2892: 1.4,
  2893: 1.4,
  2894: 1.4,
  2895: 1.4,
  2896: 1.4,
  2897: 1.4,
  3152: 4.9,
  3153: 8.3,
};

export function getSnapshotRate(exoId: number, fallback = 0): number {
  return exoboosterSnapshotRates[exoId] ?? fallback;
}

export function normalizeRatesMap(input: unknown): Record<number, number> {
  const parsed: Record<number, number> = {};
  if (!input || typeof input !== "object") return parsed;

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const exoId = Number(key);
    const rate = typeof value === "number"
      ? value
      : typeof value === "object" && value !== null && "rate" in value
        ? Number((value as { rate?: unknown }).rate)
        : Number(value);

    if (Number.isFinite(exoId) && exoId > 0 && Number.isFinite(rate) && rate > 0) {
      parsed[exoId] = rate;
    }
  }

  return parsed;
}