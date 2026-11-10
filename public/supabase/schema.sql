-- Atlas Inc. INDUSTRIAL — Supabase Schema
-- Run this in the Supabase SQL editor

create extension if not exists "uuid-ossp";

-- profiles table
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  vat text not null check (vat ~ '^[0-9]{9}$'),
  created_at timestamptz default now()
);
comment on table public.profiles is 'Public profile data for each registered user';

-- wishlist_items table
create table public.wishlist_items (
  user_id uuid not null references auth.users on delete cascade,
  part_sku text not null,
  created_at timestamptz default now(),
  primary key (user_id, part_sku)
);
comment on table public.wishlist_items is 'Wishlist items per user';

alter table public.profiles enable row level security;
alter table public.wishlist_items enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can delete own profile" on public.profiles for delete using (auth.uid() = id);

create policy "Users can view own wishlist" on public.wishlist_items for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist items" on public.wishlist_items for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist items" on public.wishlist_items for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, vat)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name','User'), coalesce(new.raw_user_meta_data->>'vat','000000000'));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
