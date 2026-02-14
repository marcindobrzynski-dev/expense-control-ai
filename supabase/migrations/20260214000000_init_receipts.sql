create table public.receipts (
  id uuid not null default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  store_name text,
  purchase_date date,
  total_amount numeric(10, 2),
  raw_ai_response jsonb
);

create table public.receipt_items (
  id uuid not null default gen_random_uuid() primary key,
  receipt_id uuid references public.receipts(id) on delete cascade,
  product_name text not null,
  quantity numeric(10, 2) default 1,
  unit_price numeric(10, 2),
  total_price numeric(10, 2)
);

alter table public.receipts enable row level security;
alter table public.receipt_items enable row level security;

create policy "Allow all actions for anon" on public.receipts for all using (true);
create policy "Allow all actions for anon" on public.receipt_items for all using (true);
