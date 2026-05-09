create table if not exists public.friends (
  slug text primary key,
  name text not null,
  pin_hash text not null,
  status text not null default 'pending' check (status in ('pending', 'ready', 'not_ready')),
  reason text,
  updated_at timestamptz
);

insert into public.friends (slug, name, pin_hash, status, reason, updated_at)
values
  ('faisal', 'Faisal', '$2b$10$2bdOTqm/0XYtxZr6i3CXYOfU4t4RJgHGKIblnGPYhAAo8IPVu8K86', 'pending', null, null),
  ('alam', 'Alam', '$2b$10$2bdOTqm/0XYtxZr6i3CXYOfU4t4RJgHGKIblnGPYhAAo8IPVu8K86', 'pending', null, null),
  ('raihan', 'Raihan', '$2b$10$2bdOTqm/0XYtxZr6i3CXYOfU4t4RJgHGKIblnGPYhAAo8IPVu8K86', 'pending', null, null),
  ('rozik', 'Rozik', '$2b$10$2bdOTqm/0XYtxZr6i3CXYOfU4t4RJgHGKIblnGPYhAAo8IPVu8K86', 'pending', null, null),
  ('ikbal', 'Ikbal', '$2b$10$2bdOTqm/0XYtxZr6i3CXYOfU4t4RJgHGKIblnGPYhAAo8IPVu8K86', 'pending', null, null),
  ('denar', 'Denar', '$2b$10$2bdOTqm/0XYtxZr6i3CXYOfU4t4RJgHGKIblnGPYhAAo8IPVu8K86', 'pending', null, null),
  ('avatar', 'Avatar', '$2b$10$2bdOTqm/0XYtxZr6i3CXYOfU4t4RJgHGKIblnGPYhAAo8IPVu8K86', 'pending', null, null)
on conflict (slug) do update set
  name = excluded.name;

alter table public.friends enable row level security;

drop policy if exists "No public direct friends access" on public.friends;
create policy "No public direct friends access"
on public.friends
for all
using (false)
with check (false);
