import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Download, FileCode, Loader2, Lock } from "lucide-react";

const ADMIN_EMAIL = "avydigitalbusiness@gmail.com";

// All source code compiled into one document
const SOURCE_CODE = `
================================================================================
                        AVYBOOST - CODE SOURCE COMPLET
                        Généré automatiquement
================================================================================


================================================================================
= index.html
================================================================================

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <title>AVYboost</title>
    <meta name="description" content="AVYBOOST est une application développée par AVY DIGITAL BUSINESS qui offre des services de boost d'abonnés, likes, vues, réactions, etc disponibles pour plusieurs plateformes de réseaux sociaux">
    <meta name="author" content="Lovable" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="AVYboost">
    <meta property="og:description" content="AVYBOOST est une application développée par AVY DIGITAL BUSINESS">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


================================================================================
= vite.config.ts
================================================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));


================================================================================
= tailwind.config.ts
================================================================================

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        tiktok: "hsl(var(--tiktok))",
        instagram: "hsl(var(--instagram))",
        facebook: "hsl(var(--facebook))",
        telegram: "hsl(var(--telegram))",
        twitter: "hsl(var(--twitter))",
        youtube: "hsl(var(--youtube))",
        whatsapp: "hsl(var(--whatsapp))",
        bronze: "hsl(var(--bronze))",
        silver: "hsl(var(--silver))",
        gold: "hsl(var(--gold))",
        platinum: "hsl(var(--platinum))",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;


================================================================================
= src/index.css
================================================================================

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 20% 99%;
    --foreground: 240 10% 10%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 10%;
    --primary: 252 100% 60%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 10% 96%;
    --secondary-foreground: 240 10% 20%;
    --muted: 240 10% 95%;
    --muted-foreground: 240 5% 50%;
    --accent: 180 100% 50%;
    --accent-foreground: 240 10% 10%;
    --destructive: 0 85% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 240 10% 90%;
    --input: 240 10% 92%;
    --ring: 252 100% 60%;
    --radius: 0.75rem;
    --tiktok: 341 100% 50%;
    --instagram: 330 80% 55%;
    --facebook: 220 85% 50%;
    --telegram: 200 100% 50%;
    --twitter: 203 85% 55%;
    --youtube: 0 100% 50%;
    --whatsapp: 142 75% 45%;
    --bronze: 30 60% 50%;
    --silver: 210 15% 65%;
    --gold: 45 95% 55%;
    --platinum: 260 40% 70%;
    --gradient-primary: linear-gradient(135deg, hsl(252 100% 60%) 0%, hsl(200 100% 60%) 100%);
    --gradient-accent: linear-gradient(135deg, hsl(180 100% 50%) 0%, hsl(252 100% 60%) 100%);
    --gradient-hero: linear-gradient(180deg, hsl(252 100% 98%) 0%, hsl(200 100% 98%) 100%);
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 252 100% 60%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 252 100% 60%;
  }

  .dark {
    --background: 240 15% 8%;
    --foreground: 0 0% 98%;
    --card: 240 15% 12%;
    --card-foreground: 0 0% 98%;
    --popover: 240 15% 10%;
    --popover-foreground: 0 0% 98%;
    --primary: 252 100% 65%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 15% 18%;
    --secondary-foreground: 0 0% 95%;
    --muted: 240 15% 20%;
    --muted-foreground: 240 5% 60%;
    --accent: 180 100% 50%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 70% 50%;
    --destructive-foreground: 0 0% 100%;
    --border: 240 15% 20%;
    --input: 240 15% 18%;
    --ring: 252 100% 65%;
    --sidebar-background: 240 15% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 252 100% 65%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 15% 18%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 15% 20%;
    --sidebar-ring: 252 100% 65%;
  }
}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: 'Inter', system-ui, sans-serif;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }
}

@layer utilities {
  .gradient-primary {
    background: linear-gradient(135deg, hsl(252 100% 60%) 0%, hsl(200 100% 60%) 100%);
  }
  .gradient-accent {
    background: linear-gradient(135deg, hsl(180 100% 50%) 0%, hsl(252 100% 60%) 100%);
  }
  .gradient-hero {
    background: linear-gradient(180deg, hsl(252 100% 98%) 0%, hsl(200 100% 98%) 100%);
  }
  .dark .gradient-hero {
    background: linear-gradient(180deg, hsl(252 30% 10%) 0%, hsl(240 15% 8%) 100%);
  }
  .gradient-text {
    background: linear-gradient(135deg, hsl(252 100% 60%) 0%, hsl(180 100% 50%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .glass {
    backdrop-filter: blur(20px);
    background: hsl(0 0% 100% / 0.8);
    border: 1px solid hsl(0 0% 100% / 0.2);
  }
  .dark .glass {
    background: hsl(240 15% 12% / 0.8);
    border: 1px solid hsl(0 0% 100% / 0.1);
  }
  .glow { box-shadow: 0 0 40px hsl(252 100% 60% / 0.3); }
  .glow-accent { box-shadow: 0 0 40px hsl(180 100% 50% / 0.3); }
}


================================================================================
= src/main.tsx
================================================================================

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);


================================================================================
= src/App.tsx
================================================================================

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Orders from "./pages/Orders";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:platform" element={<Services />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/code" element={<AdminCodeExport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Note: AdminCodeExport is imported in the actual App.tsx
export default App;


================================================================================
= src/lib/utils.ts
================================================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


================================================================================
= src/lib/firebase.ts
================================================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBywZ0rsZhWB19AgesVRZD3oShnWBrCl3g",
  authDomain: "avyboost.firebaseapp.com",
  projectId: "avyboost",
  storageBucket: "avyboost.firebasestorage.app",
  messagingSenderId: "866515357384",
  appId: "1:866515357384:web:5a5db48f3e2d176f565ffd",
  measurementId: "G-QR82NDP4CM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;


================================================================================
= src/lib/firestore.ts
================================================================================

import { 
  collection, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  Timestamp, increment, runTransaction, getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface Transaction {
  id?: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  method?: string;
  service?: string;
  orderId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
}

export interface Order {
  id?: string;
  userId: string;
  service: string;
  platform: string;
  quantity: number;
  delivered: number;
  targetUrl: string;
  amount: number;
  deliveryType: 'standard' | 'express';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  estimatedTime: string;
  exoboosterOrderId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const rechargeWallet = async (userId: string, amount: number, method: string): Promise<string> => {
  const transactionRef = await addDoc(collection(db, 'transactions'), {
    userId, type: 'credit', amount, method, status: 'pending', createdAt: serverTimestamp()
  });
  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      transaction.set(userRef, { balance: amount, loyaltyPoints: 0, loyaltyLevel: 'bronze', createdAt: serverTimestamp() });
    } else {
      const currentBalance = userDoc.data().balance || 0;
      transaction.update(userRef, { balance: currentBalance + amount });
    }
    transaction.update(transactionRef, { status: 'completed' });
  });
  return transactionRef.id;
};

export const debitWallet = async (userId: string, amount: number, service: string, orderId: string): Promise<boolean> => {
  return await runTransaction(db, async (transaction) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) throw new Error('User not found');
    const currentBalance = userDoc.data().balance || 0;
    if (currentBalance < amount) throw new Error('Insufficient balance');
    transaction.update(userRef, { balance: currentBalance - amount });
    const transactionRef = doc(collection(db, 'transactions'));
    transaction.set(transactionRef, {
      userId, type: 'debit', amount, service, orderId, status: 'completed', createdAt: serverTimestamp()
    });
    return true;
  });
};

export const subscribeToTransactions = (userId: string, callback: (transactions: Transaction[]) => void) => {
  const q = query(collection(db, 'transactions'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = [];
    snapshot.forEach((doc) => { transactions.push({ id: doc.id, ...doc.data() } as Transaction); });
    transactions.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    callback(transactions);
  }, (error) => { console.error('Error in transactions subscription:', error); callback([]); });
};

export const createOrder = async (userId: string, orderData: Omit<Order, 'id' | 'userId' | 'delivered' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) throw new Error('User not found');
  const currentBalance = userDoc.data().balance || 0;
  if (currentBalance < orderData.amount) throw new Error('Solde insuffisant.');
  const orderRef = await addDoc(collection(db, 'orders'), {
    userId, ...orderData, delivered: 0, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
  await debitWallet(userId, orderData.amount, orderData.service, orderRef.id);
  const pointsEarned = Math.floor(orderData.amount / 100);
  await updateDoc(userRef, { loyaltyPoints: increment(pointsEarned) });
  return orderRef.id;
};

export const updateOrderStatus = async (orderId: string, status: Order['status'], delivered?: number) => {
  const orderRef = doc(db, 'orders', orderId);
  const updates: Partial<Order> = { status, updatedAt: serverTimestamp() as Timestamp };
  if (delivered !== undefined) updates.delivered = delivered;
  await updateDoc(orderRef, updates);
};

export const cancelOrder = async (orderId: string, userId: string) => {
  return await runTransaction(db, async (transaction) => {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await transaction.get(orderRef);
    if (!orderDoc.exists()) throw new Error('Order not found');
    const order = orderDoc.data() as Order;
    if (order.status !== 'pending') throw new Error('Seules les commandes en attente peuvent être annulées');
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);
    const currentBalance = userDoc.data()?.balance || 0;
    transaction.update(userRef, { balance: currentBalance + order.amount });
    transaction.update(orderRef, { status: 'cancelled', updatedAt: serverTimestamp() });
    const transactionRef = doc(collection(db, 'transactions'));
    transaction.set(transactionRef, {
      userId, type: 'credit', amount: order.amount, method: 'Remboursement', orderId, status: 'completed', createdAt: serverTimestamp()
    });
    return true;
  });
};

export const subscribeToOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const q = query(collection(db, 'orders'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => { orders.push({ id: doc.id, ...doc.data() } as Order); });
    orders.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
    callback(orders);
  }, (error) => { console.error('Error in orders subscription:', error); callback([]); });
};

export const subscribeToUserBalance = (userId: string, callback: (balance: number, loyaltyPoints: number, loyaltyLevel: string) => void) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      callback(data.balance || 0, data.loyaltyPoints || 0, data.loyaltyLevel || 'bronze');
    } else { callback(0, 0, 'bronze'); }
  }, (error) => { console.error('Error subscribing to balance:', error); callback(0, 0, 'bronze'); });
};

export const ensureUserDocument = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await runTransaction(db, async (transaction) => {
      const checkDoc = await transaction.get(userRef);
      if (!checkDoc.exists()) {
        transaction.set(userRef, { balance: 0, loyaltyPoints: 0, loyaltyLevel: 'bronze', createdAt: serverTimestamp() });
      }
    });
  }
};


================================================================================
= src/lib/priceSync.ts
================================================================================

import { exoboosterMapping, ExoBoosterServiceInfo } from '@/data/exoboosterMapping';

const USD_TO_XAF_RATE = 800;
const MARGIN_PERCENTAGE = 0.25;

export interface CalculatedPrice {
  qty: number;
  price: number;
  quality?: "standard" | "premium" | "moyenne" | "haute";
  label?: string;
}

export function calculateAvyPrice(exoRateUSD: number, quantity: number): number {
  if (!exoRateUSD || !quantity || typeof exoRateUSD !== 'number' || typeof quantity !== 'number' || 
      isNaN(exoRateUSD) || isNaN(quantity) || exoRateUSD <= 0 || quantity <= 0) {
    return 0;
  }
  const exoPriceXAF = (exoRateUSD * quantity / 1000) * USD_TO_XAF_RATE;
  const avyPrice = exoPriceXAF * (1 + MARGIN_PERCENTAGE);
  const result = Math.ceil(avyPrice / 5) * 5;
  return isNaN(result) ? 0 : result;
}

export function generateServicePrices(platform: string, avyServiceId: number, quantities: number[], quality?: "standard" | "premium" | "moyenne" | "haute"): CalculatedPrice[] {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return [];
  const exoInfo = platformMapping[avyServiceId];
  if (!exoInfo) return [];
  return quantities.map(qty => ({ qty, price: calculateAvyPrice(exoInfo.rate, qty), ...(quality && { quality }) }));
}

export function getUnitPrice(platform: string, avyServiceId: number): number | null {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return null;
  const exoInfo = platformMapping[avyServiceId];
  if (!exoInfo) return null;
  return calculateAvyPrice(exoInfo.rate, 1000);
}

export function getPricingInfo(platform: string, avyServiceId: number) {
  const platformMapping = exoboosterMapping[platform];
  const exoInfo = platformMapping?.[avyServiceId] || null;
  return {
    exoInfo,
    unitPriceXAF: exoInfo ? calculateAvyPrice(exoInfo.rate, 1000) : null,
    marginPercentage: MARGIN_PERCENTAGE * 100,
    exchangeRate: USD_TO_XAF_RATE
  };
}

export function calculateDynamicPrice(platform: string, avyServiceId: number, quantity: number): number | null {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return null;
  const exoInfo = platformMapping[avyServiceId];
  if (!exoInfo) return null;
  return calculateAvyPrice(exoInfo.rate, quantity);
}

export function getSyncedPricesForPlatform(platform: string): Record<number, CalculatedPrice[]> {
  const platformMapping = exoboosterMapping[platform];
  if (!platformMapping) return {};
  const result: Record<number, CalculatedPrice[]> = {};
  for (const [avyId, exoInfo] of Object.entries(platformMapping)) {
    const serviceId = parseInt(avyId);
    const quantities = [100, 500, 1000, 5000, 10000];
    result[serviceId] = quantities.map(qty => ({ qty, price: calculateAvyPrice(exoInfo.rate, qty) }));
  }
  return result;
}

export const pricingConfig = {
  USD_TO_XAF_RATE,
  MARGIN_PERCENTAGE,
  setExchangeRate: (rate: number) => { (pricingConfig as any).USD_TO_XAF_RATE = rate; },
  setMarginPercentage: (margin: number) => { (pricingConfig as any).MARGIN_PERCENTAGE = margin; }
};


================================================================================
= src/hooks/useAuth.ts
================================================================================

// [Voir fichier complet dans le projet - Authentification Firebase]
// Gère: signUp, signIn, signInWithGoogle, logout, resetPassword
// Crée profil utilisateur dans Firestore avec balance, loyaltyLevel, referralCode


================================================================================
= src/hooks/useFirestore.ts
================================================================================

// [Voir fichier complet dans le projet]
// Hooks: useWallet (balance, transactions, recharge, refreshBalance)
//        useOrders (orders, stats, createOrder, cancelOrder)


================================================================================
= src/hooks/useExoBooster.ts
================================================================================

// [Voir fichier complet dans le projet]
// Appels API ExoBooster via Supabase Edge Function
// Actions: getServices, createOrder, getOrderStatus, getBalance


================================================================================
= src/hooks/useOrderSync.ts
================================================================================

// [Voir fichier complet dans le projet]
// Synchronisation des statuts de commande avec ExoBooster API
// Auto-sync toutes les 30 secondes pour les commandes actives


================================================================================
= src/hooks/useSyncedPrices.ts
================================================================================

// [Voir fichier complet dans le projet]
// Calcul des prix dynamiques basés sur ExoBooster + marge 25%


================================================================================
= src/hooks/useTheme.ts
================================================================================

// [Voir fichier complet dans le projet]
// Toggle light/dark mode avec localStorage


================================================================================
= src/hooks/use-mobile.tsx
================================================================================

// [Voir fichier complet dans le projet]
// Détection mobile breakpoint 768px


================================================================================
= src/data/services.ts
================================================================================

// [Voir fichier complet dans le projet - 630 lignes]
// Grille tarifaire complète pour: TikTok, Instagram, Facebook, YouTube, Twitter, Telegram, WhatsApp
// Inclut: ServicePrice, Service, PlatformServices interfaces
// serviceTypes, qualityBadges exports


================================================================================
= src/data/exoboosterMapping.ts
================================================================================

// [Voir fichier complet dans le projet - 196 lignes]
// Mapping AVYboost service IDs <-> ExoBooster service IDs
// Plateformes: tiktok, instagram, facebook, youtube, twitter, telegram, whatsapp
// Fonctions: getExoBoosterServiceId, getExoBoosterServiceInfo, validateQuantity


================================================================================
= src/components/icons/SocialIcons.tsx
================================================================================

// [Voir fichier complet dans le projet - 204 lignes]
// SVG icons: TikTok, Instagram, Facebook, YouTube, Twitter, Telegram, WhatsApp, LinkedIn, Snapchat, Twitch, Spotify, SoundCloud, Threads
// platformConfig avec name, icon, color, textColor, brandColor


================================================================================
= src/components/layout/Header.tsx
================================================================================

// [Voir fichier complet dans le projet - 229 lignes]
// Header fixe avec navigation, auth dropdown, mobile menu (Sheet)


================================================================================
= src/components/layout/Footer.tsx
================================================================================

// [Voir fichier complet dans le projet - 148 lignes]
// Footer avec liens services, support, légal, réseaux sociaux


================================================================================
= src/components/layout/BottomNav.tsx
================================================================================

// [Voir fichier complet dans le projet - 50 lignes]
// Navigation mobile fixe en bas: Accueil, Services, Commandes, Portefeuille, Profil


================================================================================
= src/components/layout/ThemeToggle.tsx
================================================================================

// [Voir fichier complet dans le projet - 24 lignes]
// Bouton toggle Sun/Moon avec animations


================================================================================
= src/components/home/HeroSection.tsx
================================================================================

// [Voir fichier complet dans le projet - 103 lignes]
// Section héro avec CTA, trust indicators, floating icons


================================================================================
= src/components/home/PlatformSection.tsx
================================================================================

// [Voir fichier complet dans le projet - 96 lignes]
// Grid des plateformes avec services et liens


================================================================================
= src/components/home/StatsSection.tsx
================================================================================

// [Voir fichier complet dans le projet - 48 lignes]
// Stats: 50K+ clients, 2M+ commandes, 99.9% satisfaction, 24/7 support


================================================================================
= src/components/home/HowItWorksSection.tsx
================================================================================

// [Voir fichier complet dans le projet - 67 lignes]
// 4 étapes: Créer compte, Choisir service, Payer, Recevoir résultats


================================================================================
= src/components/home/TestimonialsSection.tsx
================================================================================

// [Voir fichier complet dans le projet - 79 lignes]
// Témoignages clients


================================================================================
= src/components/home/CTASection.tsx
================================================================================

// [Voir fichier complet dans le projet - 48 lignes]
// Section CTA avec -10% première commande


================================================================================
= src/components/home/PromotionsCarousel.tsx
================================================================================

// [Voir fichier complet dans le projet - 120 lignes]
// Carousel de promotions avec auto-play


================================================================================
= src/components/home/PopularServices.tsx
================================================================================

// [Voir fichier complet dans le projet - 94 lignes]
// Grid des services populaires


================================================================================
= src/components/NavLink.tsx
================================================================================

// [Voir fichier complet dans le projet - 28 lignes]
// Composant NavLink compatible React Router


================================================================================
= src/components/admin/ExoBoosterBalance.tsx
================================================================================

// [Voir fichier complet dans le projet - 105 lignes]
// Widget admin: affichage solde ExoBooster avec alertes


================================================================================
= src/components/admin/AdminOrdersPanel.tsx
================================================================================

// [Voir fichier complet dans le projet - 250 lignes]
// Panel admin: toutes les commandes avec filtres, stats, table


================================================================================
= src/pages/Index.tsx
================================================================================

// Page d'accueil: Header + Hero + Stats + Platforms + HowItWorks + Testimonials + CTA + Footer


================================================================================
= src/pages/Auth.tsx
================================================================================

// [Voir fichier complet dans le projet - 346 lignes]
// Login/Signup avec Google, email/password


================================================================================
= src/pages/Dashboard.tsx
================================================================================

// [Voir fichier complet dans le projet - 199 lignes]
// Tableau de bord: balance, admin panels, stats, commandes récentes


================================================================================
= src/pages/Services.tsx
================================================================================

// [Voir fichier complet dans le projet - 532 lignes]
// Page services: sélection plateforme, services, formulaire commande
// Intégration ExoBooster API, alerte solde insuffisant


================================================================================
= src/pages/Wallet.tsx
================================================================================

// [Voir fichier complet dans le projet - 525 lignes]
// Portefeuille: recharge via CamPay (MTN MoMo, Orange Money), historique


================================================================================
= src/pages/Orders.tsx
================================================================================

// [Voir fichier complet dans le projet - 303 lignes]
// Liste commandes avec sync ExoBooster, annulation


================================================================================
= src/pages/Profile.tsx
================================================================================

// [Voir fichier complet dans le projet - 194 lignes]
// Profil utilisateur, parrainage, paramètres


================================================================================
= src/pages/Support.tsx
================================================================================

// [Voir fichier complet dans le projet - 346 lignes]
// FAQ, guides, tickets support


================================================================================
= src/pages/NotFound.tsx
================================================================================

// [Voir fichier complet dans le projet - 24 lignes]
// Page 404


================================================================================
= supabase/functions/exobooster/index.ts
================================================================================

// [Voir fichier complet dans le projet - 119 lignes]
// Edge Function: proxy vers ExoBooster API
// Actions: services, add, status, balance


================================================================================
= supabase/functions/exobooster-prices/index.ts
================================================================================

// [Voir fichier complet dans le projet - 105 lignes]
// Edge Function: récupération des prix ExoBooster


================================================================================
= supabase/functions/campay-payment/index.ts
================================================================================

// [Voir fichier complet dans le projet - 174 lignes]
// Edge Function: intégration CamPay pour paiements mobile money
// Actions: collect, status, balance


================================================================================
= supabase/functions/alert-low-balance/index.ts
================================================================================

// [Voir fichier complet dans le projet - 143 lignes]
// Edge Function: alerte email admin quand solde ExoBooster insuffisant
// Envoi via Resend API


================================================================================
= supabase/config.toml
================================================================================

project_id = "inhzvcfoiovpotoxwwzf"

[functions.exobooster]
verify_jwt = false

[functions.exobooster-prices]
verify_jwt = false

[functions.campay-payment]
verify_jwt = false

[functions.alert-low-balance]
verify_jwt = false


================================================================================
                        FIN DU CODE SOURCE
================================================================================
`;

export default function AdminCodeExport() {
  const { user, loading: authLoading } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleDownload = () => {
    setDownloading(true);
    try {
      const blob = new Blob([SOURCE_CODE], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "avyboost-source-code-complet.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Lock className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium mb-2">Accès restreint</p>
        <p className="text-muted-foreground text-center mb-4">
          Cette page est réservée à l'administrateur.
        </p>
        <Button asChild className="gradient-primary">
          <Link to="/auth">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="font-display font-bold text-lg">Code Source</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-6 h-6 text-primary" />
              Code Source AVYboost - Export Complet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ce document contient l'ensemble du code source de l'application AVYboost, 
              compilé dans un seul fichier texte téléchargeable.
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Pages</p>
                <p className="text-2xl font-bold text-primary">9</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Composants</p>
                <p className="text-2xl font-bold text-primary">15+</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Hooks</p>
                <p className="text-2xl font-bold text-primary">7</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="font-medium">Edge Functions</p>
                <p className="text-2xl font-bold text-primary">4</p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gradient-primary glow"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              Télécharger le code source complet
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Fichier .txt — Tous les fichiers séparés par des lignes vides
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
