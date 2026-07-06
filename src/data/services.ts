// AVYboost Services - Grille Tarifaire Officielle (Prix en XAF)
// Tous les prix sont basés sur la grille tarifaire officielle

export interface ServicePrice {
  qty: number;
  price: number;
  quality?: "standard" | "premium" | "moyenne" | "haute";
  label?: string;
}

export interface Service {
  id: number;
  name: string;
  type: "followers" | "likes" | "views" | "comments" | "shares" | "saves" | "members" | "subscribers" | "retweets" | "reactions" | "watchtime" | "listeners" | "live";
  prices: ServicePrice[];
  popular?: boolean;
  badges?: string[];
  deliveryTime: string;
  description?: string;
}

export interface PlatformServices {
  [key: string]: Service[];
}

export const services: PlatformServices = {
  tiktok: [
    {
      id: 1,
      name: "Followers Qualité Moyenne",
      type: "followers",
      prices: [
        { qty: 1000, price: 620, quality: "moyenne" },
        { qty: 5000, price: 3100, quality: "moyenne" },
        { qty: 10000, price: 6200, quality: "moyenne" },
      ],
      badges: ["fast"],
      deliveryTime: "1-2 heures"
    },
    {
      id: 2,
      name: "Followers Haute Qualité",
      type: "followers",
      prices: [
        { qty: 1000, price: 1000, quality: "haute" },
        { qty: 5000, price: 5000, quality: "haute" },
        { qty: 10000, price: 10000, quality: "haute" },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "1-2 heures"
    },
    {
      id: 3,
      name: "Likes Standard",
      type: "likes",
      prices: [
        { qty: 1000, price: 900, quality: "standard" },
        { qty: 5000, price: 4500, quality: "standard" },
        { qty: 10000, price: 9000, quality: "standard" },
      ],
      badges: ["fast"],
      deliveryTime: "30 minutes"
    },
    {
      id: 4,
      name: "Likes Premium",
      type: "likes",
      prices: [
        { qty: 1000, price: 1400, quality: "premium" },
        { qty: 5000, price: 7000, quality: "premium" },
        { qty: 10000, price: 14000, quality: "premium" },
      ],
      popular: true,
      badges: ["premium"],
      deliveryTime: "30 minutes"
    },
    {
      id: 5,
      name: "Impressions",
      type: "views",
      prices: [
        { qty: 1000, price: 80 },
        { qty: 10000, price: 800 },
        { qty: 100000, price: 8000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-2 heures"
    },
    {
      id: 6,
      name: "Commentaires Personnalisés",
      type: "comments",
      prices: [
        { qty: 10, price: 1800 },
        { qty: 25, price: 4500 },
        { qty: 50, price: 9000 },
      ],
      badges: ["premium"],
      deliveryTime: "6-12 heures"
    },
    {
      id: 7,
      name: "Vues Haute Qualité",
      type: "views",
      prices: [
        { qty: 1000, price: 90, quality: "haute" },
        { qty: 10000, price: 900, quality: "haute" },
        { qty: 100000, price: 9000, quality: "haute" },
      ],
      badges: ["premium"],
      deliveryTime: "1-2 heures"
    },
    {
      id: 8,
      name: "Sauvegardes Vidéo",
      type: "saves",
      prices: [
        { qty: 1000, price: 10 },
        { qty: 10000, price: 100 },
        { qty: 100000, price: 1000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 9,
      name: "Partages Vidéo",
      type: "shares",
      prices: [
        { qty: 1000, price: 100 },
        { qty: 5000, price: 500 },
        { qty: 10000, price: 1000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 24,
      name: "Commentaires Haute Qualité",
      type: "comments",
      prices: [
        { qty: 10, price: 550 },
        { qty: 25, price: 1375 },
        { qty: 50, price: 2750 },
      ],
      badges: ["premium"],
      deliveryTime: "6-12 heures"
    },
    {
      id: 25,
      name: "Likes pour Direct Live",
      type: "live",
      prices: [
        { qty: 100, price: 20, label: "100 likes" },
        { qty: 500, price: 100, label: "500 likes" },
        { qty: 1000, price: 200, label: "1000 likes" },
      ],
      badges: ["fast"],
      deliveryTime: "Pendant le live"
    },
  ],
  
  instagram: [
    {
      id: 10,
      name: "Followers Qualité Moyenne",
      type: "followers",
      prices: [
        { qty: 1000, price: 1100, quality: "moyenne" },
        { qty: 5000, price: 5500, quality: "moyenne" },
        { qty: 10000, price: 11000, quality: "moyenne" },
      ],
      badges: ["fast"],
      deliveryTime: "2-4 heures"
    },
    {
      id: 11,
      name: "Followers Haute Qualité",
      type: "followers",
      prices: [
        { qty: 1000, price: 1900, quality: "haute" },
        { qty: 5000, price: 9500, quality: "haute" },
        { qty: 10000, price: 19000, quality: "haute" },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "1-2 heures"
    },
    {
      id: 12,
      name: "Likes Standard",
      type: "likes",
      prices: [
        { qty: 1000, price: 1000, quality: "standard" },
        { qty: 5000, price: 5000, quality: "standard" },
        { qty: 10000, price: 10000, quality: "standard" },
      ],
      badges: ["fast"],
      deliveryTime: "1-2 heures"
    },
    {
      id: 13,
      name: "Likes Premium",
      type: "likes",
      prices: [
        { qty: 1000, price: 1600, quality: "premium" },
        { qty: 5000, price: 8000, quality: "premium" },
        { qty: 10000, price: 16000, quality: "premium" },
      ],
      popular: true,
      badges: ["premium"],
      deliveryTime: "30min-1h"
    },
    {
      id: 14,
      name: "Vues Reels Standard",
      type: "views",
      prices: [
        { qty: 1000, price: 100, quality: "standard" },
        { qty: 10000, price: 1000, quality: "standard" },
        { qty: 100000, price: 10000, quality: "standard" },
      ],
      badges: ["fast"],
      deliveryTime: "Instantané-1h"
    },
    {
      id: 15,
      name: "Vues Reels Premium",
      type: "views",
      prices: [
        { qty: 1000, price: 160, quality: "premium" },
        { qty: 10000, price: 1600, quality: "premium" },
        { qty: 100000, price: 16000, quality: "premium" },
      ],
      badges: ["premium"],
      deliveryTime: "Instantané"
    },
    {
      id: 16,
      name: "Vues Stories",
      type: "views",
      prices: [
        { qty: 1000, price: 275 },
        { qty: 5000, price: 1375 },
        { qty: 10000, price: 2750 },
      ],
      badges: ["fast"],
      deliveryTime: "Instantané-1h"
    },
    {
      id: 17,
      name: "Vues IGTV",
      type: "views",
      prices: [
        { qty: 1000, price: 160 },
        { qty: 5000, price: 800 },
        { qty: 10000, price: 1600 },
      ],
      badges: ["fast"],
      deliveryTime: "Instantané-2h"
    },
    {
      id: 18,
      name: "Sauvegardes",
      type: "saves",
      prices: [
        { qty: 1000, price: 2200 },
        { qty: 5000, price: 11000 },
        { qty: 10000, price: 22000 },
      ],
      badges: ["guaranteed"],
      deliveryTime: "2-6 heures"
    },
    {
      id: 19,
      name: "Impressions",
      type: "views",
      prices: [
        { qty: 1000, price: 120 },
        { qty: 10000, price: 1200 },
        { qty: 100000, price: 12000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 20,
      name: "Commentaires Personnalisés",
      type: "comments",
      prices: [
        { qty: 5, price: 600 },
        { qty: 10, price: 1100 },
        { qty: 25, price: 2500 },
      ],
      badges: ["premium"],
      deliveryTime: "2-12 heures"
    },
    {
      id: 21,
      name: "Sauvegardes",
      type: "saves",
      prices: [
        { qty: 1000, price: 2400 },
        { qty: 5000, price: 12000 },
        { qty: 10000, price: 24000 },
      ],
      badges: ["guaranteed"],
      deliveryTime: "4-8 heures"
    },
    {
      id: 22,
      name: "Partages",
      type: "shares",
      prices: [
        { qty: 1000, price: 2400 },
        { qty: 5000, price: 12000 },
        { qty: 10000, price: 24000 },
      ],
      badges: ["fast"],
      deliveryTime: "4-8 heures"
    },
    {
      id: 23,
      name: "Likes pour Direct Live",
      type: "live",
      prices: [
        { qty: 100, price: 600, label: "100 likes" },
        { qty: 500, price: 2600, label: "500 likes" },
        { qty: 1000, price: 4800, label: "1000 likes" },
      ],
      badges: ["fast"],
      deliveryTime: "Pendant le live"
    },
    {
      id: 26,
      name: "Reposts Instagram",
      type: "shares",
      prices: [
        { qty: 1000, price: 400 },
        { qty: 5000, price: 2000 },
        { qty: 10000, price: 4000 },
      ],
      badges: ["fast"],
      deliveryTime: "2-6 heures"
    },
    {
      id: 27,
      name: "Commentaires Haute Qualité",
      type: "comments",
      prices: [
        { qty: 10, price: 130 },
        { qty: 25, price: 325 },
        { qty: 50, price: 650 },
      ],
      badges: ["premium"],
      deliveryTime: "2-12 heures"
    },
    {
      id: 28,
      name: "Likes Instagram USA",
      type: "likes",
      prices: [
        { qty: 1000, price: 1720, quality: "haute" },
        { qty: 5000, price: 8600, quality: "haute" },
        { qty: 10000, price: 17200, quality: "haute" },
      ],
      badges: ["premium"],
      deliveryTime: "1-3 heures"
    },
  ],

  facebook: [
    {
      id: 30,
      name: "Likes de Page Qualité Moyenne",
      type: "likes",
      prices: [
        { qty: 1000, price: 1200, quality: "moyenne" },
        { qty: 5000, price: 6000, quality: "moyenne" },
        { qty: 10000, price: 12000, quality: "moyenne" },
      ],
      badges: ["fast"],
      deliveryTime: "1-2 jours"
    },
    {
      id: 31,
      name: "Likes de Page Haute Qualité",
      type: "likes",
      prices: [
        { qty: 1000, price: 2000, quality: "haute" },
        { qty: 5000, price: 10000, quality: "haute" },
        { qty: 10000, price: 20000, quality: "haute" },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "1-2 jours"
    },
    {
      id: 32,
      name: "Followers Profil Qualité Moyenne",
      type: "followers",
      prices: [
        { qty: 1000, price: 1300, quality: "moyenne" },
        { qty: 5000, price: 6500, quality: "moyenne" },
        { qty: 10000, price: 13000, quality: "moyenne" },
      ],
      badges: ["fast"],
      deliveryTime: "1-2 jours"
    },
    {
      id: 33,
      name: "Followers Profil Haute Qualité",
      type: "followers",
      prices: [
        { qty: 1000, price: 2200, quality: "haute" },
        { qty: 5000, price: 11000, quality: "haute" },
        { qty: 10000, price: 22000, quality: "haute" },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "1-2 jours"
    },
    {
      id: 34,
      name: "Likes Post Standard",
      type: "likes",
      prices: [
        { qty: 1000, price: 800, quality: "standard" },
        { qty: 5000, price: 4000, quality: "standard" },
        { qty: 10000, price: 8000, quality: "standard" },
      ],
      badges: ["fast"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 35,
      name: "Likes Post Premium",
      type: "likes",
      prices: [
        { qty: 1000, price: 1300, quality: "premium" },
        { qty: 5000, price: 6500, quality: "premium" },
        { qty: 10000, price: 13000, quality: "premium" },
      ],
      badges: ["premium"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 36,
      name: "Vues Vidéo",
      type: "views",
      prices: [
        { qty: 1000, price: 120 },
        { qty: 10000, price: 1200 },
        { qty: 100000, price: 12000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 37,
      name: "Partages",
      type: "shares",
      prices: [
        { qty: 1000, price: 3000 },
        { qty: 5000, price: 15000 },
        { qty: 10000, price: 30000 },
      ],
      badges: ["guaranteed"],
      deliveryTime: "6-24 heures"
    },
    {
      id: 38,
      name: "Commentaires Personnalisés",
      type: "comments",
      prices: [
        { qty: 10, price: 1200 },
        { qty: 25, price: 2700 },
        { qty: 50, price: 5400 },
      ],
      badges: ["premium"],
      deliveryTime: "6-24 heures"
    },
    {
      id: 39,
      name: "Vues Vidéo Haute Qualité",
      type: "views",
      prices: [
        { qty: 1000, price: 150, quality: "haute" },
        { qty: 10000, price: 1500, quality: "haute" },
        { qty: 100000, price: 15000, quality: "haute" },
      ],
      badges: ["premium"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 48,
      name: "Réaction J'aime",
      type: "reactions",
      prices: [
        { qty: 1000, price: 420 },
        { qty: 5000, price: 2100 },
        { qty: 10000, price: 4200 },
      ],
      badges: ["fast"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 49,
      name: "Réaction Haha",
      type: "reactions",
      prices: [
        { qty: 1000, price: 420 },
        { qty: 5000, price: 2100 },
        { qty: 10000, price: 4200 },
      ],
      badges: ["fast"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 58,
      name: "Réaction Wow",
      type: "reactions",
      prices: [
        { qty: 1000, price: 420 },
        { qty: 5000, price: 2100 },
        { qty: 10000, price: 4200 },
      ],
      badges: ["fast"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 59,
      name: "Réaction Triste",
      type: "reactions",
      prices: [
        { qty: 1000, price: 420 },
        { qty: 5000, price: 2100 },
        { qty: 10000, price: 4200 },
      ],
      badges: ["fast"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 66,
      name: "Réaction En colère",
      type: "reactions",
      prices: [
        { qty: 1000, price: 420 },
        { qty: 5000, price: 2100 },
        { qty: 10000, price: 4200 },
      ],
      badges: ["fast"],
      deliveryTime: "1-6 heures"
    },
    {
      id: 67,
      name: "Membres Groupe Qualité Moyenne",
      type: "members",
      prices: [
        { qty: 1000, price: 1200, quality: "moyenne" },
        { qty: 5000, price: 6000, quality: "moyenne" },
        { qty: 10000, price: 12000, quality: "moyenne" },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 jours"
    },
    {
      id: 68,
      name: "Membres Groupe Haute Qualité",
      type: "members",
      prices: [
        { qty: 1000, price: 1800, quality: "haute" },
        { qty: 5000, price: 9000, quality: "haute" },
        { qty: 10000, price: 18000, quality: "haute" },
      ],
      badges: ["premium"],
      deliveryTime: "1-3 jours"
    },
    {
      id: 69,
      name: "Commentaires Personnalisés Masculin",
      type: "comments",
      prices: [
        { qty: 10, price: 910 },
        { qty: 25, price: 2275 },
        { qty: 50, price: 4550 },
      ],
      badges: ["premium"],
      deliveryTime: "6-24 heures"
    },
    {
      id: 74,
      name: "Commentaires Personnalisés Féminin",
      type: "comments",
      prices: [
        { qty: 10, price: 1040 },
        { qty: 25, price: 2600 },
        { qty: 50, price: 5200 },
      ],
      badges: ["premium"],
      deliveryTime: "6-24 heures"
    },
    {
      id: 75,
      name: "Avis pour Page",
      type: "comments",
      prices: [
        { qty: 10, price: 560 },
        { qty: 25, price: 1400 },
        { qty: 50, price: 2800 },
      ],
      badges: ["premium"],
      deliveryTime: "1-3 jours"
    },
  ],

  youtube: [
    {
      id: 40,
      name: "Abonnés Qualité Moyenne",
      type: "subscribers",
      prices: [
        { qty: 1000, price: 10000, quality: "moyenne" },
        { qty: 5000, price: 50000, quality: "moyenne" },
        { qty: 10000, price: 100000, quality: "moyenne" },
      ],
      badges: ["guaranteed"],
      deliveryTime: "3-7 jours"
    },
    {
      id: 41,
      name: "Abonnés Haute Qualité",
      type: "subscribers",
      prices: [
        { qty: 1000, price: 16000, quality: "haute" },
        { qty: 5000, price: 80000, quality: "haute" },
        { qty: 10000, price: 160000, quality: "haute" },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "5-10 jours"
    },
    {
      id: 42,
      name: "Vues Standard",
      type: "views",
      prices: [
        { qty: 1000, price: 400, quality: "standard" },
        { qty: 10000, price: 4000, quality: "standard" },
        { qty: 100000, price: 40000, quality: "standard" },
      ],
      badges: ["fast"],
      deliveryTime: "6-12 heures"
    },
    {
      id: 43,
      name: "Vues Premium",
      type: "views",
      prices: [
        { qty: 1000, price: 700, quality: "premium" },
        { qty: 10000, price: 7000, quality: "premium" },
        { qty: 100000, price: 70000, quality: "premium" },
      ],
      popular: true,
      badges: ["premium"],
      deliveryTime: "3-6 heures"
    },
    {
      id: 44,
      name: "Likes",
      type: "likes",
      prices: [
        { qty: 1000, price: 6000 },
        { qty: 5000, price: 30000 },
        { qty: 10000, price: 60000 },
      ],
      badges: ["guaranteed"],
      deliveryTime: "1-3 jours"
    },
    {
      id: 76,
      name: "Likes Haute Qualité",
      type: "likes",
      prices: [
        { qty: 1000, price: 6000, quality: "haute" },
        { qty: 5000, price: 30000, quality: "haute" },
        { qty: 10000, price: 60000, quality: "haute" },
      ],
      badges: ["premium", "guaranteed"],
      deliveryTime: "1-3 jours"
    },
    {
      id: 45,
      name: "Vues Shorts",
      type: "views",
      prices: [
        { qty: 1000, price: 200 },
        { qty: 10000, price: 2000 },
        { qty: 100000, price: 20000 },
      ],
      badges: ["fast"],
      deliveryTime: "Instantané-2h"
    },
    {
      id: 46,
      name: "Commentaires Personnalisés",
      type: "comments",
      prices: [
        { qty: 10, price: 3000 },
        { qty: 25, price: 7000 },
        { qty: 50, price: 14000 },
      ],
      badges: ["premium"],
      deliveryTime: "1-5 jours"
    },
    {
      id: 47,
      name: "Watch Time",
      type: "watchtime",
      prices: [
        { qty: 100, price: 30000, label: "100 heures" },
        { qty: 500, price: 140000, label: "500 heures" },
        { qty: 1000, price: 280000, label: "1000 heures" },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "5-20 jours"
    },
  ],

  twitter: [
    {
      id: 50,
      name: "Followers Qualité Moyenne",
      type: "followers",
      prices: [
        { qty: 1000, price: 1800, quality: "moyenne" },
        { qty: 5000, price: 9000, quality: "moyenne" },
        { qty: 10000, price: 18000, quality: "moyenne" },
      ],
      badges: ["fast"],
      deliveryTime: "2-4 heures"
    },
    {
      id: 51,
      name: "Followers Haute Qualité",
      type: "followers",
      prices: [
        { qty: 1000, price: 3000, quality: "haute" },
        { qty: 5000, price: 15000, quality: "haute" },
        { qty: 10000, price: 30000, quality: "haute" },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 52,
      name: "Likes",
      type: "likes",
      prices: [
        { qty: 1000, price: 2000 },
        { qty: 5000, price: 10000 },
        { qty: 10000, price: 20000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 53,
      name: "Retweets",
      type: "retweets",
      prices: [
        { qty: 1000, price: 3400 },
        { qty: 5000, price: 17000 },
        { qty: 10000, price: 34000 },
      ],
      badges: ["guaranteed"],
      deliveryTime: "2-6 heures"
    },
  ],

  telegram: [
    {
      id: 60,
      name: "Membres Qualité Moyenne",
      type: "members",
      prices: [
        { qty: 1000, price: 2000, quality: "moyenne" },
        { qty: 5000, price: 10000, quality: "moyenne" },
        { qty: 10000, price: 20000, quality: "moyenne" },
      ],
      badges: ["fast"],
      deliveryTime: "2-6 heures"
    },
    {
      id: 61,
      name: "Membres Haute Qualité",
      type: "members",
      prices: [
        { qty: 1000, price: 3600, quality: "haute" },
        { qty: 5000, price: 18000, quality: "haute" },
        { qty: 10000, price: 36000, quality: "haute" },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "4-12 heures"
    },
    {
      id: 62,
      name: "Vues",
      type: "views",
      prices: [
        { qty: 1000, price: 160 },
        { qty: 10000, price: 1600 },
        { qty: 100000, price: 16000 },
      ],
      badges: ["fast"],
      deliveryTime: "Instantané-1h"
    },
    {
      id: 63,
      name: "Réactions",
      type: "reactions",
      prices: [
        { qty: 1000, price: 1000 },
        { qty: 5000, price: 5000 },
        { qty: 10000, price: 10000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 64,
      name: "Réactions Pouce",
      type: "reactions",
      prices: [
        { qty: 1000, price: 30 },
        { qty: 5000, price: 150 },
        { qty: 10000, price: 300 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 65,
      name: "Réactions Cœur",
      type: "reactions",
      prices: [
        { qty: 1000, price: 30 },
        { qty: 5000, price: 150 },
        { qty: 10000, price: 300 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 77,
      name: "Vues Automatiques",
      type: "views",
      prices: [
        { qty: 1000, price: 4 },
        { qty: 10000, price: 40 },
        { qty: 100000, price: 400 },
      ],
      badges: ["fast"],
      deliveryTime: "Automatique"
    },
    {
      id: 78,
      name: "Réactions Négatives",
      type: "reactions",
      prices: [
        { qty: 1000, price: 30 },
        { qty: 5000, price: 150 },
        { qty: 10000, price: 300 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 79,
      name: "Réactions Feu",
      type: "reactions",
      prices: [
        { qty: 1000, price: 30 },
        { qty: 5000, price: 150 },
        { qty: 10000, price: 300 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 80,
      name: "Réactions Rire",
      type: "reactions",
      prices: [
        { qty: 1000, price: 30 },
        { qty: 5000, price: 150 },
        { qty: 10000, price: 300 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
  ],

  whatsapp: [
    {
      id: 120,
      name: "Membres Chaîne Mondial",
      type: "members",
      prices: [
        { qty: 1000, price: 2800 },
        { qty: 5000, price: 14000 },
        { qty: 10000, price: 28000 },
      ],
      popular: true,
      badges: ["premium", "guaranteed"],
      deliveryTime: "1-7 jours"
    },
    {
      id: 121,
      name: "Membres Chaîne États-Unis",
      type: "members",
      prices: [
        { qty: 1000, price: 4500 },
        { qty: 5000, price: 22500 },
        { qty: 10000, price: 45000 },
      ],
      badges: ["premium"],
      deliveryTime: "1-7 jours"
    },
    {
      id: 122,
      name: "Membres Chaîne Inde",
      type: "members",
      prices: [
        { qty: 1000, price: 4500 },
        { qty: 5000, price: 22500 },
        { qty: 10000, price: 45000 },
      ],
      badges: ["premium"],
      deliveryTime: "1-7 jours"
    },
    {
      id: 123,
      name: "Réactions Emoji Mix",
      type: "reactions",
      prices: [
        { qty: 1000, price: 1400 },
        { qty: 5000, price: 7000 },
        { qty: 10000, price: 14000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 124,
      name: "Réactions Emoji Pouce",
      type: "reactions",
      prices: [
        { qty: 1000, price: 1400 },
        { qty: 5000, price: 7000 },
        { qty: 10000, price: 14000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 125,
      name: "Réactions Emoji Cœur",
      type: "reactions",
      prices: [
        { qty: 1000, price: 1400 },
        { qty: 5000, price: 7000 },
        { qty: 10000, price: 14000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 126,
      name: "Réactions Emoji Rire",
      type: "reactions",
      prices: [
        { qty: 1000, price: 1400 },
        { qty: 5000, price: 7000 },
        { qty: 10000, price: 14000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 127,
      name: "Réactions Emoji Surprise",
      type: "reactions",
      prices: [
        { qty: 1000, price: 1400 },
        { qty: 5000, price: 7000 },
        { qty: 10000, price: 14000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 128,
      name: "Réactions Emoji Triste",
      type: "reactions",
      prices: [
        { qty: 1000, price: 1400 },
        { qty: 5000, price: 7000 },
        { qty: 10000, price: 14000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 129,
      name: "Réactions Emoji Prière",
      type: "reactions",
      prices: [
        { qty: 1000, price: 1400 },
        { qty: 5000, price: 7000 },
        { qty: 10000, price: 14000 },
      ],
      badges: ["fast"],
      deliveryTime: "1-3 heures"
    },
    {
      id: 130,
      name: "Membres Potato Chat Moyenne Qualité",
      type: "members",
      prices: [
        { qty: 1000, price: 4900, quality: "moyenne" },
        { qty: 5000, price: 24500, quality: "moyenne" },
        { qty: 10000, price: 49000, quality: "moyenne" },
      ],
      badges: ["fast"],
      deliveryTime: "1-7 jours"
    },
    {
      id: 131,
      name: "Membres Potato Chat Haute Qualité",
      type: "members",
      prices: [
        { qty: 1000, price: 8300, quality: "haute" },
        { qty: 5000, price: 41500, quality: "haute" },
        { qty: 10000, price: 83000, quality: "haute" },
      ],
      badges: ["premium"],
      deliveryTime: "1-7 jours"
    },
  ],
};

export const serviceTypes = [
  { id: "all", name: "Tous" },
  { id: "followers", name: "Followers" },
  { id: "likes", name: "Likes" },
  { id: "views", name: "Vues" },
  { id: "comments", name: "Commentaires" },
  { id: "shares", name: "Partages" },
  { id: "saves", name: "Sauvegardes" },
  { id: "reactions", name: "Réactions" },
  { id: "live", name: "Live" },
  { id: "members", name: "Membres" },
  { id: "subscribers", name: "Abonnés" },
];

import { Zap, Star, Shield } from "lucide-react";

export const qualityBadges = {
  fast: { label: "Rapide", icon: Zap, color: "bg-yellow-500/10 text-yellow-600" },
  premium: { label: "Premium", icon: Star, color: "bg-purple-500/10 text-purple-600" },
  guaranteed: { label: "Garanti", icon: Shield, color: "bg-green-500/10 text-green-600" },
};
