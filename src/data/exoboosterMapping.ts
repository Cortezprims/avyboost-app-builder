// Mapping between AVYboost service IDs and ExoBooster service IDs
// Based on ExoBooster API response

import { getSnapshotRate } from "./exoboosterSnapshotRates";

export interface ExoBoosterServiceInfo {
  exoId: number;
  name: string;
  min: number;
  max: number;
  rate: number; // USD per 1000
  category: string;
}

// TikTok Services Mapping
export const tiktokMapping: Record<number, ExoBoosterServiceInfo> = {
  // Followers Qualité Moyenne (AVY ID: 1)
  1: { exoId: 3036, name: "Abonnés TikTok (qualité moyenne)", min: 10, max: 1000000, rate: getSnapshotRate(3036, 1.41), category: "Abonnés TikTok" },
  // Followers Haute Qualité (AVY ID: 2)
  2: { exoId: 3037, name: "Abonnés TikTok (haute qualité)", min: 10, max: 1000000, rate: getSnapshotRate(3037, 1.80), category: "Abonnés TikTok" },
  // Likes Standard (AVY ID: 3)
  3: { exoId: 3048, name: "J'aime sur TikTok (qualité moyenne)", min: 10, max: 5000000, rate: getSnapshotRate(3048, 0.05), category: "Likes TikTok" },
  // Likes Premium (AVY ID: 4)
  4: { exoId: 3049, name: "J'aime sur TikTok (haute qualité)", min: 5, max: 5000000, rate: getSnapshotRate(3049, 0.14), category: "Likes TikTok" },
  // Impressions/Views (AVY ID: 5)
  5: { exoId: 3047, name: "Vues TikTok (qualité moyenne)", min: 50, max: 2147483647, rate: getSnapshotRate(3047, 0.005), category: "Vues TikTok" },
  // Commentaires Personnalisés (AVY ID: 6)
  6: { exoId: 3154, name: "Commentaires de qualité moyenne", min: 1, max: 5000, rate: getSnapshotRate(3154, 1.50), category: "Commentaires personnalisés TikTok" },
  7: { exoId: 3043, name: "Vues TikTok (haute qualité)", min: 50, max: 2147483647, rate: getSnapshotRate(3043, 0.09), category: "Vues TikTok" },
  8: { exoId: 3051, name: "Enregistrements vidéo", min: 10, max: 1000000, rate: getSnapshotRate(3051, 0.01), category: "Sauvegardes vidéo TikTok" },
  9: { exoId: 3054, name: "Partages vidéo", min: 10, max: 1000000, rate: getSnapshotRate(3054, 0.10), category: "Partages Vidéo TikTok" },
  24: { exoId: 3101, name: "Commentaires de haute qualité", min: 1, max: 5000, rate: getSnapshotRate(3101, 55), category: "Commentaires personnalisés TikTok" },
  25: { exoId: 3102, name: "Likes en direct sur Tiktok de haute qualité", min: 10, max: 1000000, rate: getSnapshotRate(3102, 0.20), category: "J'aime pour direct Tiktok" },
};

// Instagram Services Mapping
export const instagramMapping: Record<number, ExoBoosterServiceInfo> = {
  // Followers Qualité Moyenne (AVY ID: 10)
  10: { exoId: 3106, name: "Abonnés Instagram (qualité moyenne)", min: 10, max: 100000, rate: getSnapshotRate(3106, 1.24), category: "Abonnés Instagram" },
  // Followers Haute Qualité (AVY ID: 11)
  11: { exoId: 3107, name: "Abonnés Instagram (haute qualité)", min: 10, max: 100000, rate: getSnapshotRate(3107, 1.70), category: "Abonnés Instagram" },
  // Likes Standard (AVY ID: 12)
  12: { exoId: 2997, name: "J'aime Instagram (qualité moyenne)", min: 10, max: 100000, rate: getSnapshotRate(2997, 0.21), category: "Likes Instagram" },
  // Likes Premium (AVY ID: 13)
  13: { exoId: 2998, name: "J'aime Instagram (haute qualité)", min: 10, max: 100000, rate: getSnapshotRate(2998, 0.30), category: "Likes Instagram" },
  // Vues Reels Standard (AVY ID: 14)
  14: { exoId: 3108, name: "Vues vidéos/reels Instagram (qualité moyenne)", min: 10, max: 2147483647, rate: getSnapshotRate(3108, 0.002), category: "Vues vidéos/reels Instagram" },
  // Vues Reels Premium (AVY ID: 15)
  15: { exoId: 3109, name: "Vues vidéos/reels Instagram (haute qualité)", min: 10, max: 2147483647, rate: getSnapshotRate(3109, 0.005), category: "Vues vidéos/reels Instagram" },
  // Vues Stories (AVY ID: 16)
  16: { exoId: 3017, name: "Vues story Instagram (haute qualité)", min: 100, max: 12000, rate: getSnapshotRate(3017, 0.21), category: "Vues stories Instagram" },
  // Vues IGTV (AVY ID: 17) - Using Reel views as IGTV alternative
  17: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: getSnapshotRate(3108, 0.002), category: "Instagram Video/Reel Views" },
  // Sauvegardes (AVY ID: 18) - Not available in ExoBooster, use views as fallback
  18: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: getSnapshotRate(3108, 0.002), category: "Instagram Video/Reel Views" },
  // Impressions (AVY ID: 19)
  19: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: getSnapshotRate(3108, 0.002), category: "Instagram Video/Reel Views" },
  // Commentaires Personnalisés (AVY ID: 20)
  20: { exoId: 3014, name: "Commentaires Instagram (qualité moyenne)", min: 10, max: 10000, rate: getSnapshotRate(3014, 6.00), category: "Commentaires Instagram" },
  // Sauvegardes Premium (AVY ID: 21) - Not available
  21: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: getSnapshotRate(3108, 0.002), category: "Instagram Video/Reel Views" },
  // Partages (AVY ID: 22) - Not available
  22: { exoId: 3156, name: "Partages Instagram (haute qualité)", min: 10, max: 1000000, rate: getSnapshotRate(3156, 0.2), category: "Partages Instagram" },
  // Likes pour Direct Live (AVY ID: 23)
  23: { exoId: 2997, name: "Instagram Likes ( Average Quality )", min: 10, max: 100000, rate: getSnapshotRate(2997, 0.21), category: "Instagram Likes" },
  26: { exoId: 3157, name: "Reposts Instagram", min: 10, max: 1000000, rate: getSnapshotRate(3157, 0.4), category: "Reposts Instagram" },
  27: { exoId: 3015, name: "Commentaires Instagram (haute qualité)", min: 10, max: 10000, rate: getSnapshotRate(3015, 13), category: "Commentaires Instagram" },
  28: { exoId: 3119, name: "Likes Instagram US (haute moyenne)", min: 10, max: 100000, rate: getSnapshotRate(3119, 1.72), category: "Services Instagram États-Unis" },
};

// Facebook Services Mapping
export const facebookMapping: Record<number, ExoBoosterServiceInfo> = {
  // Likes de Page Qualité Moyenne (AVY ID: 30)
  30: { exoId: 3123, name: "Abonnés de page Facebook (qualité moyenne)", min: 100, max: 5000000, rate: getSnapshotRate(3123, 0.62), category: "Abonnés pour page Facebook" },
  // Likes de Page Haute Qualité (AVY ID: 31)
  31: { exoId: 3124, name: "Abonnés de page Facebook (haute qualité)", min: 100, max: 5000000, rate: getSnapshotRate(3124, 0.62), category: "Abonnés pour page Facebook" },
  // Followers Profil Qualité Moyenne (AVY ID: 32)
  32: { exoId: 3125, name: "Abonnés pour profil Facebook (qualité moyenne)", min: 100, max: 5000000, rate: getSnapshotRate(3125, 0.62), category: "Abonnés pour profil Facebook" },
  // Followers Profil Haute Qualité (AVY ID: 33)
  33: { exoId: 3126, name: "Abonnés pour profil Facebook (haute qualité)", min: 100, max: 5000000, rate: getSnapshotRate(3126, 1.00), category: "Abonnés pour profil Facebook" },
  // Likes Post Standard (AVY ID: 34)
  34: { exoId: 3129, name: "J'aimes pour publications Facebook (qualité moyenne)", min: 10, max: 500000, rate: getSnapshotRate(3129, 0.14), category: "Likes pour publications Facebook" },
  // Likes Post Premium (AVY ID: 35)
  35: { exoId: 3130, name: "J'aimes pour publications Facebook (haute moyenne)", min: 10, max: 500000, rate: getSnapshotRate(3130, 0.40), category: "Likes pour publications Facebook" },
  // Vues Vidéo (AVY ID: 36)
  36: { exoId: 3137, name: "Vues pour vidéos/reels Facebook (qualité moyenne)", min: 100, max: 2147483647, rate: getSnapshotRate(3137, 0.09), category: "Vues pour vidéos/reels Facebook" },
  // Partages (AVY ID: 37)
  37: { exoId: 2975, name: "Partages pour publications Facebook (haute qualité)", min: 10, max: 10000000, rate: getSnapshotRate(2975, 0.90), category: "Partages pour publications Facebook" },
  // Commentaires Personnalisés (AVY ID: 38)
  38: { exoId: 3139, name: "Commentaires Globaux Facebook", min: 10, max: 250, rate: getSnapshotRate(3139, 91.00), category: "Commentaires Facebook" },
  39: { exoId: 3138, name: "Vues pour vidéos/reels Facebook (haute moyenne)", min: 100, max: 2147483647, rate: getSnapshotRate(3138, 0.15), category: "Vues pour vidéos/reels Facebook" },
  48: { exoId: 3131, name: "Réaction Facebook J'aime", min: 10, max: 500000, rate: getSnapshotRate(3131, 0.42), category: "Réactions Emoji Facebook" },
  49: { exoId: 3133, name: "Réaction Facebook Haha", min: 10, max: 500000, rate: getSnapshotRate(3133, 0.42), category: "Réactions Emoji Facebook" },
  58: { exoId: 3132, name: "Réaction Facebook Wow", min: 10, max: 500000, rate: getSnapshotRate(3132, 0.42), category: "Réactions Emoji Facebook" },
  59: { exoId: 3134, name: "Réaction Facebook Triste", min: 10, max: 500000, rate: getSnapshotRate(3134, 0.42), category: "Réactions Emoji Facebook" },
  66: { exoId: 3135, name: "Réaction Facebook En colère", min: 10, max: 500000, rate: getSnapshotRate(3135, 0.42), category: "Réactions Emoji Facebook" },
  67: { exoId: 2932, name: "Membres pour groupe Facebook (qualité moyenne)", min: 100, max: 1000000, rate: getSnapshotRate(2932, 1.2), category: "Membres pour groupe Facebook" },
  68: { exoId: 3136, name: "Membres pour groupe Facebook (haute qualité)", min: 100, max: 1000000, rate: getSnapshotRate(3136, 1.8), category: "Membres pour groupe Facebook" },
  69: { exoId: 3155, name: "Commentaires personnalisés Facebook (Masculin)", min: 10, max: 250, rate: getSnapshotRate(3155, 91), category: "Commentaires Facebook" },
  74: { exoId: 3140, name: "Commentaires personnalisés Facebook (Feminin)", min: 10, max: 250, rate: getSnapshotRate(3140, 104), category: "Commentaires Facebook" },
  75: { exoId: 3141, name: "Avis pour page Facebook (qualité moyenne)", min: 1, max: 5000, rate: getSnapshotRate(3141, 56), category: "Avis pour page Facebook" },
};

// YouTube Services Mapping
export const youtubeMapping: Record<number, ExoBoosterServiceInfo> = {
  // Abonnés Qualité Moyenne (AVY ID: 40)
  40: { exoId: 3056, name: "Abonnés YouTube (qualité moyenne)", min: 50, max: 50000, rate: getSnapshotRate(3056, 23.00), category: "Abonnés YouTube" },
  // Abonnés Haute Qualité (AVY ID: 41)
  41: { exoId: 3058, name: "Abonnés YouTube (haute qualité)", min: 50, max: 50000, rate: getSnapshotRate(3058, 26.00), category: "Abonnés YouTube" },
  // Vues Standard (AVY ID: 42)
  42: { exoId: 3061, name: "Vues YouTube (qualité moyenne)", min: 100, max: 10000000, rate: getSnapshotRate(3061, 1.00), category: "Vues YouTube" },
  // Vues Premium (AVY ID: 43)
  43: { exoId: 3062, name: "Vues YouTube (haute qualité)", min: 100, max: 10000000, rate: getSnapshotRate(3062, 1.40), category: "Vues YouTube" },
  // Likes (AVY ID: 44)
  44: { exoId: 3080, name: "Likes YouTube (qualité moyenne)", min: 10, max: 1000000, rate: getSnapshotRate(3080, 0.27), category: "Likes YouTube" },
  // Vues Shorts (AVY ID: 45)
  45: { exoId: 3061, name: "YouTube Views (Average Quality)", min: 100, max: 10000000, rate: getSnapshotRate(3061, 1.00), category: "Youtube Views" },
  // Commentaires Personnalisés (AVY ID: 46)
  46: { exoId: 3151, name: "Commentaires personnalisés YouTube (haute qualité)", min: 10, max: 50000, rate: getSnapshotRate(3151, 10.00), category: "Commentaires YouTube" },
  // Watch Time (AVY ID: 47) - Not directly available, use views
  47: { exoId: 3062, name: "YouTube Views (High Quality)", min: 100, max: 10000000, rate: getSnapshotRate(3062, 1.40), category: "Youtube Views" },
  76: { exoId: 3149, name: "Likes YouTube (haute qualité)", min: 10, max: 1000000, rate: getSnapshotRate(3149, 6), category: "Likes YouTube" },
};

// Twitter/X Services Mapping
export const twitterMapping: Record<number, ExoBoosterServiceInfo> = {
  // Followers Qualité Moyenne (AVY ID: 50) - Not available, use likes
  50: { exoId: 3146, name: "Twitter Likes (Average Quality)", min: 20, max: 1000, rate: 0.80, category: "X/Twitter Likes" },
  // Followers Haute Qualité (AVY ID: 51) - Not available, use likes
  51: { exoId: 3145, name: "Twitter Likes (High Quality)", min: 20, max: 1000, rate: 1.00, category: "X/Twitter Likes" },
  // Likes Standard (AVY ID: 52)
  52: { exoId: 3146, name: "Twitter Likes (Average Quality)", min: 20, max: 1000, rate: 0.80, category: "X/Twitter Likes" },
  // Likes Premium (AVY ID: 53)
  53: { exoId: 3145, name: "Twitter Likes (High Quality)", min: 20, max: 1000, rate: 1.00, category: "X/Twitter Likes" },
  // Retweets Standard (AVY ID: 54)
  54: { exoId: 3147, name: "Twitter Retweets (Average Quality)", min: 10, max: 150, rate: 7.00, category: "X/Twitter Retweets/Reposts" },
  // Retweets Premium (AVY ID: 55)
  55: { exoId: 3148, name: "Twitter Retweets (High Quality)", min: 5, max: 50, rate: 7.50, category: "X/Twitter Retweets/Reposts" },
  // Impressions (AVY ID: 56) - Use likes as fallback
  56: { exoId: 3146, name: "Twitter Likes (Average Quality)", min: 20, max: 1000, rate: 0.80, category: "X/Twitter Likes" },
  // Commentaires (AVY ID: 57) - Use likes as fallback
  57: { exoId: 3146, name: "Twitter Likes (Average Quality)", min: 20, max: 1000, rate: 0.80, category: "X/Twitter Likes" },
};

// Telegram Services Mapping
export const telegramMapping: Record<number, ExoBoosterServiceInfo> = {
  // Membres Qualité Moyenne (AVY ID: 60)
  60: { exoId: 3143, name: "Membres Telegram (qualité moyenne)", min: 500, max: 200000, rate: getSnapshotRate(3143, 1.00), category: "Membres Telegram" },
  // Membres Haute Qualité (AVY ID: 61)
  61: { exoId: 3144, name: "Membres Telegram (haute qualité)", min: 500, max: 200000, rate: getSnapshotRate(3144, 1.40), category: "Membres Telegram" },
  // Vues Post (AVY ID: 62)
  62: { exoId: 2801, name: "Vues Telegram (haute qualité)", min: 10, max: 2147483647, rate: getSnapshotRate(2801, 0.028), category: "Vues pour publications Telegram" },
  // Réactions Positives (AVY ID: 63)
  63: { exoId: 2733, name: "Telegram - Réactions positives", min: 10, max: 1000000, rate: getSnapshotRate(2733, 0.06), category: "Réactions Telegram" },
  // Réactions Like (AVY ID: 64)
  64: { exoId: 2738, name: "Telegram - Réactions (👍)", min: 10, max: 1000000, rate: getSnapshotRate(2738, 0.06), category: "Réactions Telegram" },
  // Réactions Coeur (AVY ID: 65)
  65: { exoId: 2735, name: "Telegram - Réactions (❤️)", min: 10, max: 1000000, rate: getSnapshotRate(2735, 0.06), category: "Réactions Telegram" },
  77: { exoId: 2804, name: "Vues automatiques Telegram", min: 10, max: 2147483647, rate: getSnapshotRate(2804, 0.004), category: "Telegram - Vues automatiques" },
  78: { exoId: 2734, name: "Telegram - Réactions négatives", min: 10, max: 1000000, rate: getSnapshotRate(2734, 0.03), category: "Réactions Telegram" },
  79: { exoId: 2736, name: "Telegram - Réactions (🔥)", min: 10, max: 1000000, rate: getSnapshotRate(2736, 0.03), category: "Réactions Telegram" },
  80: { exoId: 2737, name: "Telegram - Réactions (🤣)", min: 10, max: 1000000, rate: getSnapshotRate(2737, 0.03), category: "Réactions Telegram" },
};

// WhatsApp Services Mapping
export const whatsappMapping: Record<number, ExoBoosterServiceInfo> = {
  120: { exoId: 2880, name: "Membres pour chaîne WhatsApp (mondial)", min: 10, max: 50000, rate: getSnapshotRate(2880, 2.50), category: "Membres pour chaîne WhatsApp" },
  121: { exoId: 2878, name: "Membres pour chaîne WhatsApp (États-Unis)", min: 10, max: 50000, rate: getSnapshotRate(2878, 4.50), category: "Membres pour chaîne WhatsApp" },
  122: { exoId: 2879, name: "Membres pour chaîne WhatsApp (Inde)", min: 10, max: 50000, rate: getSnapshotRate(2879, 4.50), category: "Membres pour chaîne WhatsApp" },
  123: { exoId: 2891, name: "Réactions Emoji pour chaîne WhatsApp (mix)", min: 10, max: 50000, rate: getSnapshotRate(2891, 1.20), category: "Réactions Emoji pour chaîne WhatsApp" },
  124: { exoId: 2892, name: "Réactions Emoji pour chaîne WhatsApp (👍)", min: 10, max: 50000, rate: getSnapshotRate(2892, 1.20), category: "Réactions Emoji pour chaîne WhatsApp" },
  125: { exoId: 2893, name: "Réactions Emoji pour chaîne WhatsApp (❤️)", min: 10, max: 50000, rate: getSnapshotRate(2893, 1.20), category: "Réactions Emoji pour chaîne WhatsApp" },
  126: { exoId: 2894, name: "Réactions Emoji pour chaîne WhatsApp (😂)", min: 10, max: 50000, rate: getSnapshotRate(2894, 1.40), category: "Réactions Emoji pour chaîne WhatsApp" },
  127: { exoId: 2895, name: "Réactions Emoji pour chaîne WhatsApp (😮)", min: 10, max: 50000, rate: getSnapshotRate(2895, 1.40), category: "Réactions Emoji pour chaîne WhatsApp" },
  128: { exoId: 2896, name: "Réactions Emoji pour chaîne WhatsApp (😥)", min: 10, max: 50000, rate: getSnapshotRate(2896, 1.40), category: "Réactions Emoji pour chaîne WhatsApp" },
  129: { exoId: 2897, name: "Réactions Emoji pour chaîne WhatsApp (🙏)", min: 10, max: 50000, rate: getSnapshotRate(2897, 1.40), category: "Réactions Emoji pour chaîne WhatsApp" },
  130: { exoId: 3152, name: "Membres Potato Chat (qualité moyenne)", min: 10, max: 50000, rate: getSnapshotRate(3152, 4.90), category: "Membres Potato Chat" },
  131: { exoId: 3153, name: "Membres Potato Chat (haute qualité)", min: 10, max: 50000, rate: getSnapshotRate(3153, 8.30), category: "Membres Potato Chat" },
};

// Combined mapping for all platforms
export const exoboosterMapping: Record<string, Record<number, ExoBoosterServiceInfo>> = {
  tiktok: tiktokMapping,
  instagram: instagramMapping,
  facebook: facebookMapping,
  youtube: youtubeMapping,
  twitter: twitterMapping,
  telegram: telegramMapping,
  whatsapp: whatsappMapping,
};

// Get ExoBooster service ID from AVYboost service ID
export function getExoBoosterServiceId(platform: string, avyServiceId: number): number | null {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return null;
  
  const serviceInfo = platformMapping[avyServiceId];
  return serviceInfo?.exoId || null;
}

// Get ExoBooster service info from AVYboost service ID
export function getExoBoosterServiceInfo(platform: string, avyServiceId: number): ExoBoosterServiceInfo | null {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return null;
  
  return platformMapping[avyServiceId] || null;
}

// Validate quantity against ExoBooster limits
export function validateQuantity(platform: string, avyServiceId: number, quantity: number): { valid: boolean; min: number; max: number; message?: string } {
  const serviceInfo = getExoBoosterServiceInfo(platform, avyServiceId);
  
  if (!serviceInfo) {
    return { valid: false, min: 0, max: 0, message: "Service non trouvé" };
  }
  
  if (quantity < serviceInfo.min) {
    return { valid: false, min: serviceInfo.min, max: serviceInfo.max, message: `Minimum: ${serviceInfo.min}` };
  }
  
  if (quantity > serviceInfo.max) {
    return { valid: false, min: serviceInfo.min, max: serviceInfo.max, message: `Maximum: ${serviceInfo.max}` };
  }
  
  return { valid: true, min: serviceInfo.min, max: serviceInfo.max };
}
