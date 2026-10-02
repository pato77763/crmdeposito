-- ==============================================================================
-- SCHEMA COMPLETO DO SUPABASE - DIEGO BEBIDAS CRM
-- ==============================================================================
-- Instruções:
-- 1. Acesse o seu painel do Supabase: https://supabase.com/dashboard/project/jxsavpadnkktqcrvvngq
-- 2. Vá no menu lateral em "SQL Editor" -> "New query"
-- 3. Cole todo este script e clique no botão verde "Run"
-- ==============================================================================

-- 1. TABELA DE PRODUTOS & CATÁLOGO
create table if not exists public.produtos (
  id text primary key,
  codigo text not null,
  nome text not null,
  categoria text not null,
  preco_custo numeric default 0,
  preco_venda numeric default 0,
  preco_atacado numeric default 0,
  qtd_min_atacado integer default 12,
  estoque_atual integer default 0,
  estoque_deposito integer default 0,
  estoque_geladeira integer default 0,
  estoque_minimo integer default 0,
  tipo_embalagem text default 'Lata 350ml',
  local_deposito text default 'Depósito Central',
  fornecedor text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. TABELA DE MOVIMENTAÇÕES DE ESTOQUE (LOGÍSTICA & AUDITORIA)
create table if not exists public.movimentacoes_estoque (
  id text primary key,
  produto_id text references public.produtos(id) on delete cascade,
  tipo text not null, -- 'ENTRADA', 'SAIDA', 'TRANSFERENCIA'
  quantidade integer not null,
  motivo text,
  origem text,
  destino text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. TABELA DE VENDAS (PDV FRENTE DE CAIXA)
create table if not exists public.vendas (
  id text primary key,
  numero_venda integer,
  subtotal numeric not null,
  desconto numeric default 0,
  total numeric not null,
  forma_pagamento text not null,
  valor_pago numeric,
  troco numeric default 0,
  nome_cliente text,
  telefone_cliente text,
  status text default 'concluida',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. TABELA DE ITENS DA VENDA
create table if not exists public.itens_venda (
  id text primary key,
  venda_id text references public.vendas(id) on delete cascade,
  produto_id text,
  nome_produto text not null,
  quantidade integer not null,
  preco_unitario numeric not null,
  total numeric not null,
  tipo_embalagem text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. TABELA DO FINANCEIRO (FLUXO DE CAIXA / RECEITAS & DESPESAS)
create table if not exists public.financeiro (
  id text primary key,
  tipo text not null, -- 'RECEITA', 'DESPESA'
  categoria text not null,
  descricao text not null,
  valor numeric not null,
  forma_pagamento text not null,
  venda_id text,
  data timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. TABELA DE CONFIGURAÇÕES DA DISTRIBUIDORA
create table if not exists public.configuracoes (
  id text primary key default 'config_principal',
  nome_loja text default 'Diego Bebidas',
  subtitulo text default 'Distribuidora, Depósito & Conveniência de Bebidas',
  cnpj text default '38.924.112/0001-45',
  telefone text default '(11) 98452-9011',
  endereco text default 'Av. das Nações, 1420 - Centro Comercial de Bebidas',
  chave_pix text default 'diegobebidas@gmail.com',
  mensagem_cupom text default 'Obrigado pela preferência! Bebidas geladas no precinho é na Diego Bebidas.',
  som_habilitado boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
alter table public.produtos enable row level security;
alter table public.movimentacoes_estoque enable row level security;
alter table public.vendas enable row level security;
alter table public.itens_venda enable row level security;
alter table public.financeiro enable row level security;
alter table public.configuracoes enable row level security;

-- POLÍTICAS DE ACESSO (PERMITIR ACESSO PARA ANÔNIMO E AUTENTICADO)
drop policy if exists "Acesso produtos" on public.produtos;
create policy "Acesso produtos" on public.produtos for all using (true) with check (true);

drop policy if exists "Acesso movimentacoes" on public.movimentacoes_estoque;
create policy "Acesso movimentacoes" on public.movimentacoes_estoque for all using (true) with check (true);

drop policy if exists "Acesso vendas" on public.vendas;
create policy "Acesso vendas" on public.vendas for all using (true) with check (true);

drop policy if exists "Acesso itens_venda" on public.itens_venda;
create policy "Acesso itens_venda" on public.itens_venda for all using (true) with check (true);

drop policy if exists "Acesso financeiro" on public.financeiro;
create policy "Acesso financeiro" on public.financeiro for all using (true) with check (true);

drop policy if exists "Acesso configuracoes" on public.configuracoes;
create policy "Acesso configuracoes" on public.configuracoes for all using (true) with check (true);
