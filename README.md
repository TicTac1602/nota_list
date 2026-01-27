# NotaList 📋

Application de gestion de tâches orientée notaires - "Todo list sous stéroïdes"

## 🎯 Fonctionnalités

- ✅ **Ajout rapide de tâches** : Interface intuitive pour créer des tâches en un clic
- 🎨 **Priorisation visuelle** : 4 niveaux de priorité (Basse, Moyenne, Haute, Urgent)
- 📊 **Organisation par statut** : Colonnes À faire / En cours / Terminée
- 👤 **Métadonnées notariales** : Nom du client et numéro de dossier
- 🔐 **Authentification sécurisée** : Via Supabase Auth
- ⚡ **Interface rapide** : Next.js 15 avec App Router
- 🎨 **Design personnel** : Interface moderne et conviviale

## 🚀 Tech Stack

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Database** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **Deployment** : Vercel

## 📦 Installation

### 1. Cloner le repo
```bash
git clone https://github.com/TicTac1602/nota_list.git
cd nota_list
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Supabase

Suivez les instructions dans [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) pour :
- Créer un projet Supabase
- Configurer la base de données
- Obtenir vos clés API

### 4. Variables d'environnement

Créez un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Structure du projet

```
nota_list/
├── app/
│   ├── page.tsx              # Page principale (liste des tâches)
│   ├── login/page.tsx        # Page de connexion
│   ├── signup/page.tsx       # Page d'inscription
│   └── auth/callback/        # Callback OAuth
├── components/
│   ├── QuickAddTask.tsx      # Composant d'ajout rapide
│   └── TaskCard.tsx          # Carte de tâche
├── lib/
│   ├── actions/
│   │   └── tasks.ts          # Server Actions pour les tâches
│   ├── supabase/
│   │   ├── client.ts         # Client Supabase (browser)
│   │   ├── server.ts         # Client Supabase (server)
│   │   └── middleware.ts     # Middleware auth
│   └── types/
│       └── database.ts       # Types TypeScript
└── middleware.ts             # Middleware Next.js (auth)
```

## 🎨 Utilisation

### Créer une tâche rapidement
1. Tapez le titre dans la barre d'ajout
2. Appuyez sur Entrée pour créer avec priorité moyenne
3. Ou cliquez pour développer et ajouter plus de détails

### Éditer une tâche
1. Cliquez sur l'icône ✏️
2. Modifiez les champs
3. Sauvegardez

### Changer le statut
- Utilisez le sélecteur de statut sur chaque carte
- Les tâches se déplacent automatiquement entre les colonnes

### Gérer les priorités
- 🟢 **Basse** : Tâches non urgentes
- ➡️ **Moyenne** : Tâches standard
- ⚡ **Haute** : Priorité élevée
- 🔥 **Urgent** : À traiter immédiatement

## 🚢 Déploiement sur Vercel

### 1. Push sur GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Déployer sur Vercel
- Allez sur [vercel.com](https://vercel.com)
- Importez votre repo GitHub
- Ajoutez les variables d'environnement :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Déployez !

### 3. Configurer Supabase
- Dans Supabase Dashboard > Authentication > URL Configuration
- Ajoutez l'URL de production : `https://votre-app.vercel.app`
- Ajoutez le callback : `https://votre-app.vercel.app/auth/callback`

## 🔐 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Les utilisateurs ne voient que leurs propres tâches
- Authentication via tokens JWT sécurisés
- Variables sensibles dans `.env.local` (non versionné)

## 📈 Améliorations futures

- [ ] Drag & drop pour réorganiser les tâches
- [ ] Filtres par client/dossier
- [ ] Dates d'échéance avec rappels
- [ ] Recherche full-text
- [ ] Export PDF/CSV
- [ ] Thème sombre
- [ ] Application mobile
- [ ] Notifications push
- [ ] Récurrence de tâches
- [ ] Pièces jointes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
