// Mapping between AVYboost service IDs and ExoBooster service IDs
// Based on ExoBooster API response

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
  1: { exoId: 3036, name: "Tiktok Followers (Average Quality)", min: 10, max: 1000000, rate: 1.41, category: "Tiktok Followers" },
  // Followers Haute Qualité (AVY ID: 2)
  2: { exoId: 3037, name: "Tiktok Followers (High Quality)", min: 10, max: 1000000, rate: 1.80, category: "Tiktok Followers" },
  // Likes Standard (AVY ID: 3)
  3: { exoId: 3048, name: "Tiktok Likes (Average Quality)", min: 10, max: 5000000, rate: 0.05, category: "Tiktok Likes" },
  // Likes Premium (AVY ID: 4)
  4: { exoId: 3049, name: "TikTok Likes (High Quality)", min: 5, max: 5000000, rate: 0.14, category: "Tiktok Likes" },
  // Impressions/Views (AVY ID: 5)
  5: { exoId: 3047, name: "Tiktok Views (Average Quality)", min: 50, max: 2147483647, rate: 0.005, category: "Tiktok Views" },
  // Commentaires Personnalisés (AVY ID: 6)
  6: { exoId: 3154, name: "Average Quality Comments", min: 1, max: 5000, rate: 1.50, category: "Tiktok Custom Comments" },
};

// Instagram Services Mapping
export const instagramMapping: Record<number, ExoBoosterServiceInfo> = {
  // Followers Qualité Moyenne (AVY ID: 10)
  10: { exoId: 3106, name: "Instagram Followers ( Average Quality )", min: 10, max: 100000, rate: 1.24, category: "Instagram Followers" },
  // Followers Haute Qualité (AVY ID: 11)
  11: { exoId: 3107, name: "Instagram Followers ( High Quality )", min: 10, max: 100000, rate: 1.70, category: "Instagram Followers" },
  // Likes Standard (AVY ID: 12)
  12: { exoId: 2997, name: "Instagram Likes ( Average Quality )", min: 10, max: 100000, rate: 0.21, category: "Instagram Likes" },
  // Likes Premium (AVY ID: 13)
  13: { exoId: 2998, name: "Instagram Likes ( High Quality )", min: 10, max: 100000, rate: 0.30, category: "Instagram Likes" },
  // Vues Reels Standard (AVY ID: 14)
  14: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: 0.002, category: "Instagram Video/Reel Views" },
  // Vues Reels Premium (AVY ID: 15)
  15: { exoId: 3109, name: "Instagram Video/Reel Views ( High Quality )", min: 10, max: 2147483647, rate: 0.005, category: "Instagram Video/Reel Views" },
  // Vues Stories (AVY ID: 16)
  16: { exoId: 3017, name: "Instagram Story Views ( High Quality )", min: 100, max: 12000, rate: 0.21, category: "Instagram Story Views" },
  // Vues IGTV (AVY ID: 17) - Using Reel views as IGTV alternative
  17: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: 0.002, category: "Instagram Video/Reel Views" },
  // Sauvegardes (AVY ID: 18) - Not available in ExoBooster, use views as fallback
  18: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: 0.002, category: "Instagram Video/Reel Views" },
  // Impressions (AVY ID: 19)
  19: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: 0.002, category: "Instagram Video/Reel Views" },
  // Commentaires Personnalisés (AVY ID: 20)
  20: { exoId: 3014, name: "Instagram Comments ( Average Quality )", min: 10, max: 10000, rate: 6.00, category: "Instagram Comments" },
  // Sauvegardes Premium (AVY ID: 21) - Not available
  21: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: 0.002, category: "Instagram Video/Reel Views" },
  // Partages (AVY ID: 22) - Not available
  22: { exoId: 3108, name: "Instagram Video/Reel Views ( Average Quality )", min: 10, max: 2147483647, rate: 0.002, category: "Instagram Video/Reel Views" },
  // Likes pour Direct Live (AVY ID: 23)
  23: { exoId: 2997, name: "Instagram Likes ( Average Quality )", min: 10, max: 100000, rate: 0.21, category: "Instagram Likes" },
};

// Facebook Services Mapping
export const facebookMapping: Record<number, ExoBoosterServiceInfo> = {
  // Likes de Page Qualité Moyenne (AVY ID: 30)
  30: { exoId: 3123, name: "Facebook Page Followers ( Average Quality )", min: 100, max: 5000000, rate: 0.62, category: "Facebook Page Followers" },
  // Likes de Page Haute Qualité (AVY ID: 31)
  31: { exoId: 3124, name: "Facebook Page Followers ( High Quality )", min: 100, max: 5000000, rate: 0.62, category: "Facebook Page Followers" },
  // Followers Profil Qualité Moyenne (AVY ID: 32)
  32: { exoId: 3125, name: "Facebook Profile Followers ( Average Quality )", min: 100, max: 5000000, rate: 0.62, category: "Facebook Profile Followers" },
  // Followers Profil Haute Qualité (AVY ID: 33)
  33: { exoId: 3126, name: "Facebook Profile Followers ( High Quality )", min: 100, max: 5000000, rate: 1.00, category: "Facebook Profile Followers" },
  // Likes Post Standard (AVY ID: 34)
  34: { exoId: 3129, name: "Facebook Post Likes (Average Quality)", min: 10, max: 500000, rate: 0.14, category: "Facebook Post Likes" },
  // Likes Post Premium (AVY ID: 35)
  35: { exoId: 3130, name: "Facebook Post Likes (High Quality)", min: 10, max: 500000, rate: 0.40, category: "Facebook Post Likes" },
  // Vues Vidéo (AVY ID: 36)
  36: { exoId: 3137, name: "Facebook Video/Reel Views (Average Quality)", min: 100, max: 2147483647, rate: 0.09, category: "Facebook Video/Reel Views" },
  // Partages (AVY ID: 37)
  37: { exoId: 2975, name: "Facebook Post Shares (High Quality)", min: 10, max: 10000000, rate: 0.90, category: "Facebook Post Shares" },
  // Commentaires Personnalisés (AVY ID: 38)
  38: { exoId: 3139, name: "Facebook Custom Comments ( Male )", min: 10, max: 250, rate: 91.00, category: "Facebook Comments" },
};

// YouTube Services Mapping
export const youtubeMapping: Record<number, ExoBoosterServiceInfo> = {
  // Abonnés Qualité Moyenne (AVY ID: 40)
  40: { exoId: 3056, name: "YouTube Subscribers (Average Quality)", min: 50, max: 50000, rate: 23.00, category: "Youtube Subscribers" },
  // Abonnés Haute Qualité (AVY ID: 41)
  41: { exoId: 3058, name: "YouTube Subscribers (High Quality)", min: 50, max: 50000, rate: 26.00, category: "Youtube Subscribers" },
  // Vues Standard (AVY ID: 42)
  42: { exoId: 3061, name: "YouTube Views (Average Quality)", min: 100, max: 10000000, rate: 1.00, category: "Youtube Views" },
  // Vues Premium (AVY ID: 43)
  43: { exoId: 3062, name: "YouTube Views (High Quality)", min: 100, max: 10000000, rate: 1.40, category: "Youtube Views" },
  // Likes (AVY ID: 44)
  44: { exoId: 3080, name: "YouTube Likes (Average Quality)", min: 10, max: 1000000, rate: 0.27, category: "Youtube Likes" },
  // Vues Shorts (AVY ID: 45)
  45: { exoId: 3061, name: "YouTube Views (Average Quality)", min: 100, max: 10000000, rate: 1.00, category: "Youtube Views" },
  // Commentaires Personnalisés (AVY ID: 46)
  46: { exoId: 3151, name: "Youtube Custom Comments (High Quality)", min: 10, max: 50000, rate: 10.00, category: "Youtube Comments" },
  // Watch Time (AVY ID: 47) - Not directly available, use views
  47: { exoId: 3062, name: "YouTube Views (High Quality)", min: 100, max: 10000000, rate: 1.40, category: "Youtube Views" },
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
  60: { exoId: 3143, name: "Telegram Members (Average Quality)", min: 500, max: 200000, rate: 1.00, category: "Telegram Members" },
  // Membres Haute Qualité (AVY ID: 61)
  61: { exoId: 3144, name: "Telegram Members (High Quality)", min: 500, max: 200000, rate: 1.40, category: "Telegram Members" },
  // Vues Post (AVY ID: 62)
  62: { exoId: 2801, name: "Telegram Views (High quality)", min: 10, max: 2147483647, rate: 0.028, category: "Telegram Post Views" },
  // Réactions Positives (AVY ID: 63)
  63: { exoId: 2733, name: "Telegram - Positive reactions (👍 ❤️ 🔥 🎉)", min: 10, max: 1000000, rate: 0.06, category: "Telegram Reactions" },
  // Réactions Like (AVY ID: 64)
  64: { exoId: 2738, name: "Telegram - Reactions (👍)", min: 10, max: 1000000, rate: 0.06, category: "Telegram Reactions" },
  // Réactions Coeur (AVY ID: 65)
  65: { exoId: 2735, name: "Telegram - Reactions (❤️)", min: 10, max: 1000000, rate: 0.06, category: "Telegram Reactions" },
};

// WhatsApp Services Mapping
export const whatsappMapping: Record<number, ExoBoosterServiceInfo> = {
  // Membres Canal Global (AVY ID: 70)
  70: { exoId: 2880, name: "Whatsapp Channel Members (Global 🌎)", min: 10, max: 50000, rate: 2.50, category: "Whatsapp Channel Members" },
  // Réactions Emoji Mix (AVY ID: 71)
  71: { exoId: 2891, name: "Whatsapp Channel Emoji Reactions (👍❤️😂😲😥🙏)", min: 10, max: 50000, rate: 1.20, category: "Whatsapp Channel Emoji Reactions" },
  // Réactions Like (AVY ID: 72)
  72: { exoId: 2892, name: "Whatsapp Channel Emoji Reactions (👍)", min: 10, max: 50000, rate: 1.20, category: "Whatsapp Channel Emoji Reactions" },
  // Réactions Coeur (AVY ID: 73)
  73: { exoId: 2893, name: "Whatsapp Channel Emoji Reactions (❤️)", min: 10, max: 50000, rate: 1.20, category: "Whatsapp Channel Emoji Reactions" },
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
