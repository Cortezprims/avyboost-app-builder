## Refonte design & navigation AvyBoost

Objectif : moderniser l'identité visuelle (Midnight Indigo + Outfit/Figtree) et restructurer le Dashboard en hub modulaire avec layout bento pour faciliter le repérage des fonctionnalités.

### 1. Design system (index.css + tailwind.config.ts)

Nouvelle palette Midnight Indigo en HSL :
- `--background` : `240 33% 6%` (#0a0a1a) / mode clair : `240 20% 98%`
- `--card` : `240 39% 14%` (#141432)
- `--primary` : `243 75% 59%` (#4f46e5)
- `--primary-glow` : `250 80% 70%`
- `--secondary` : `240 51% 24%` (#1e1e5a)
- `--accent` : `250 80% 65%`
- `--muted` / `--border` recalibrés pour la profondeur sombre
- Mode clair adapté avec les mêmes accents

Tokens enrichis :
- `--gradient-primary` : indigo → violet électrique
- `--gradient-hero` : radial glow indigo profond
- `--gradient-card` : verre nuit subtil
- `--shadow-glow`, `--shadow-elegant`, `--shadow-card`
- Animations : `glow-pulse`, `fade-up`, `shimmer`

Typographie via Google Fonts dans `index.html` :
- Outfit (display/headings) → `font-display`
- Figtree (body) → `font-sans`
- Mise à jour `tailwind.config.ts` fontFamily

### 2. Restructuration du Dashboard (hub modulaire bento)

Réorganisation de `src/pages/Dashboard.tsx` en grille bento responsive :

```text
┌─────────────────────┬───────────┐
│  Solde (hero large) │ Quick     │
│  + Recharger/Refresh│ Actions   │
├──────────┬──────────┼───────────┤
│ Commandes│ En cours │ Complétées│
├──────────┴──────────┴───────────┤
│  Services populaires (carousel) │
├─────────────────────────────────┤
│  Promotions                     │
├─────────────────────────────────┤
│  Commandes récentes             │
└─────────────────────────────────┘
```

Sections Admin regroupées dans un composant `AdminHub` avec **onglets** (Tabs shadcn) :
- Utilisateurs · Commandes · Transactions · Notifications · ExoBooster · Code source
- Affiché uniquement pour `avydigitalbusiness@gmail.com`
- Remplace l'empilement actuel des 6 panneaux qui surcharge le Dashboard

### 3. Navigation simplifiée

`src/components/layout/BottomNav.tsx` : conserver les 5 onglets mais redessiner avec :
- Indicateur actif animé (pilule glow indigo)
- Icônes plus grandes, label toujours visible
- Effet glass renforcé

Header Dashboard :
- Logo + nom à gauche
- NotificationBell + ThemeToggle + Avatar à droite (inchangé)
- Suppression du bouton "Espace Administrateur" isolé (déplacé dans AdminHub)

### 4. Cohérence visuelle globale

- `Header.tsx` : appliquer nouveau gradient et police Outfit sur le wordmark
- `PromotionsCarousel`, `PopularServices` : cartes avec `--gradient-card` + bordure subtile indigo
- Boutons CTA : `gradient-primary` + `shadow-glow` au hover
- Pages `Wallet`, `Orders`, `Services`, `Profile` : adopter les nouvelles cartes et titres en Outfit (changements purement stylistiques, logique intacte)

### 5. Fichiers touchés

- `index.html` (import fonts)
- `src/index.css` (tokens HSL, gradients, animations)
- `tailwind.config.ts` (fontFamily, couleurs étendues)
- `src/pages/Dashboard.tsx` (refonte bento + extraction AdminHub)
- `src/components/admin/AdminHub.tsx` (**nouveau** — onglets regroupant les 6 panneaux admin)
- `src/components/layout/BottomNav.tsx` (style)
- `src/components/layout/Header.tsx` (typo/gradient)
- Légers ajustements stylistiques : `PromotionsCarousel.tsx`, `PopularServices.tsx`, `Wallet.tsx`, `Orders.tsx`, `Profile.tsx`

### Hors scope

- Aucune modification de logique métier (auth, Firestore, paiements, sync)
- Aucune nouvelle route ni nouvelle fonctionnalité
- Les composants admin existants (AdminUsersPanel, etc.) sont réutilisés tels quels, seulement regroupés dans AdminHub
