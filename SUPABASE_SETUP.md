# Configuration Supabase

## 1. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL du projet et votre clé anon (API key)

## 2. Configurer les variables d'environnement
Mettez à jour le fichier `.env.local` avec vos vraies valeurs :
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

## 3. Créer la table des tâches
Dans l'éditeur SQL de Supabase, exécutez ce script :

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tasks table
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null check (status in ('todo', 'in_progress', 'done')),
  client_name text,
  file_number text,
  due_date timestamptz,
  order_index integer not null default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table tasks enable row level security;

-- Create policies
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

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_tasks_updated_at
  before update on tasks
  for each row
  execute function update_updated_at_column();

-- Create index for performance
create index tasks_user_id_idx on tasks(user_id);
create index tasks_status_idx on tasks(status);
create index tasks_priority_idx on tasks(priority);
create index tasks_due_date_idx on tasks(due_date);
```

## 4. Configurer l'authentification
Dans Supabase Dashboard :
1. Allez dans Authentication > Settings
2. Activez Email authentication
3. Désactivez "Confirm email" pour le développement (optionnel)
4. Configurez l'URL du site : `http://localhost:3000`
5. Ajoutez les redirect URLs :
   - `http://localhost:3000/auth/callback`
   - Plus tard : `https://votre-app.vercel.app/auth/callback`

## 5. Déploiement sur Vercel
Ajoutez les variables d'environnement dans les paramètres de votre projet Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
