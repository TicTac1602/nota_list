# NotaList 📋

Application de gestion de dossiers orientée notaires avec interface Kanban moderne.

## 🎯 Fonctionnalités

- ✅ **Ajout rapide de dossiers** : Modal intuitive pour créer des dossiers
- 🎨 **Priorisation visuelle** : 4 niveaux de priorité (Basse, Moyenne, Haute, Urgent)
- 📊 **Kanban Board** : Colonnes À faire / En cours / Terminée avec drag & drop
- 🔍 **Filtres avancés** : Recherche par titre, filtres par priorité et client
- 👤 **Métadonnées notariales** : Nom du client et numéro de dossier
- 🎯 **Déplacement flexible** : Drag & drop ou menu "Déplacer vers..."
- 🔐 **Sécurité renforcée** : RLS Supabase, données isolées par utilisateur
- ⚡ **Interface réactive** : Next.js 15 avec App Router et Server Actions
- ♿ **Accessibilité** : Contraste WCAG AA/AAA

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

Créez un projet sur [supabase.com](https://supabase.com) et exécutez le SQL suivant :

```sql
-- Créer la table tasks
create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text not null check (status in ('in_progress', 'done')),
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  client_name text,
  file_number text,
  order_index integer not null default 0,
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activer RLS
alter table tasks enable row level security;

-- Policies RLS
create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can create their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- Index pour performance
create index tasks_user_id_idx on tasks(user_id);
create index tasks_status_idx on tasks(status);
```

### 4. Variables d'environnement

Copiez `.env.example` vers `.env.local` et remplissez vos valeurs :
```bash
cp .env.example .env.local
```

Obtenez vos clés depuis Supabase Dashboard > Settings > API

### 5. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

## 🗄️ Structure du projet

```
nota_list/
├── app/
│   ├── page.tsx              # Dashboard Kanban principal
│   ├── login/page.tsx        # Page de connexion
│   ├── signup/page.tsx       # Page d'inscription
│   └── auth/callback/        # Callback OAuth
├── components/
│   ├── Filters.tsx           # Barre de filtres + ajout de dossier
│   ├── TaskCard.tsx          # Carte de dossier avec drag & drop
│   └── Modal.tsx             # Modal réutilisable
├── lib/
│   ├── actions/
│   │   └── tasks.ts          # Server Actions CRUD
│   ├── supabase/
│   │   ├── client.ts         # Client Supabase (browser)
│   │   ├── server.ts         # Client Supabase (server)
│   │   └── middleware.ts     # Middleware auth
│   └── types/
│       └── database.ts       # Types TypeScript
└── middleware.ts             # Middleware Next.js (protection routes)
```

## 🎨 Utilisation

### Créer une dossier
1. Cliquez sur le bouton "Nouvelle dossier"
2. Remplissez le titre (obligatoire)
3. Ajoutez optionnellement client, n° dossier
4. Sélectionnez une priorité
5. Créez !

### Déplacer une dossier
**Méthode 1 - Drag & Drop :**
- Glissez la carte d'une colonne à l'autre
- Un indicateur visuel apparaît sur la zone de drop

**Méthode 2 - Menu "Déplacer" :**
- Cliquez sur "Déplacer vers..."
- Sélectionnez la colonne de destination

### Éditer une dossier
1. Cliquez sur l'icône ✏️ (visible au survol)
2. Modifiez les champs
3. Sauvegardez ou annulez

### Filtrer les dossiers
- **Recherche** : Titre, client ou n° dossier
- **Priorité** : Filtrer par niveau de priorité
- **Client** : Filtrer par nom de client
- **Réinitialiser** : Bouton pour effacer tous les filtres

## 🚢 Déploiement sur Vercel

### 1. Push sur GitHub
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### 2. Déployer sur Vercel
1. Importez le repo sur [vercel.com](https://vercel.com)
2. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Déployez automatiquement

### 3. Configurer Supabase
Dans Supabase Dashboard > Authentication > URL Configuration :
- **Site URL** : `https://votre-app.vercel.app`
- **Redirect URLs** : `https://votre-app.vercel.app/auth/callback`

## 🔐 Sécurité

- ✅ Row Level Security (RLS) activé
- ✅ Isolation des données par utilisateur
- ✅ Tokens JWT sécurisés
- ✅ Variables sensibles non versionnées
- ✅ Validation côté serveur avec Server Actions

## 📝 License

MIT

---

Développé avec ❤️ pour optimiser la gestion de dossiers notariales
