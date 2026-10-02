import { createClient } from '@supabase/supabase-js';

// Função para garantir que a URL do Supabase esteja sempre limpa e no formato base correto,
// mesmo se o usuário copiar com /rest/v1/ no final
function sanitizeSupabaseUrl(url?: string): string {
  if (!url || typeof url !== 'string') return 'https://jxsavpadnkktqcrvvngq.supabase.co';
  let clean = url.trim();
  // Remove qualquer /rest/v1/ ou /rest/v1 no final
  clean = clean.replace(/\/rest\/v1\/?$/i, '');
  // Remove /auth/v1 se tiver
  clean = clean.replace(/\/auth\/v1\/?$/i, '');
  // Remove barras finais
  clean = clean.replace(/\/+$/, '');
  return clean || 'https://jxsavpadnkktqcrvvngq.supabase.co';
}

const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4c2F2cGFkbmtrdHFjcnZ2bmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MTQ3MzEsImV4cCI6MjEwNjQ5MDczMX0.UWeepyDiS2Ze9Kl7MyJlCG9E44jdxmy3kSGdoPMTSzM';

// Proteção contra uso acidental de chaves secretas (service_role) no frontend/navegador
function sanitizeSupabaseKey(key?: string): string {
  if (!key || typeof key !== 'string') return DEFAULT_ANON_KEY;
  const clean = key.trim();

  // Supabase proíbe chamadas vindas do navegador com service_role ou secret key
  try {
    if (clean.startsWith('sbp_') || clean.startsWith('secret_')) {
      console.warn('Chave secreta detectada. Usando chave pública anônima no navegador.');
      return DEFAULT_ANON_KEY;
    }
    const parts = clean.split('.');
    if (parts.length === 3) {
      // Decode JWT payload
      const base64Url = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64Url)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const parsed = JSON.parse(jsonPayload);
      if (parsed.role === 'service_role') {
        console.warn('Chave com role service_role detectada no navegador! O Supabase bloqueia requisições do frontend com chave secreta. Revertendo para chave anônima (anon public).');
        return DEFAULT_ANON_KEY;
      }
    }
  } catch (e) {
    // ignore parsing errors
  }

  return clean || DEFAULT_ANON_KEY;
}

const rawSupabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://jxsavpadnkktqcrvvngq.supabase.co';

export const SUPABASE_URL = sanitizeSupabaseUrl(rawSupabaseUrl);

const rawAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
export const SUPABASE_ANON_KEY = sanitizeSupabaseKey(rawAnonKey);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * SQL Schema Helper for creating tables in Supabase SQL Editor if needed
 */
export const SUPABASE_SQL_SETUP = `-- Script SQL para criar as tabelas no Supabase (Diego Bebidas CRM)
-- Cole no SQL Editor do seu projeto Supabase: https://supabase.com/dashboard/project/jxsavpadnkktqcrvvngq/sql

-- 1. Tabela de Produtos
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

-- 2. Tabela de Movimentações de Estoque
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

-- 3. Tabela de Vendas
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

-- 4. Tabela de Itens da Venda
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

-- 5. Tabela do Financeiro (Fluxo de Caixa)
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

-- 6. Tabela de Configurações
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

-- Habilitar RLS e permitir acesso público/anon para desenvolvimento
alter table public.produtos enable row level security;
alter table public.movimentacoes_estoque enable row level security;
alter table public.vendas enable row level security;
alter table public.itens_venda enable row level security;
alter table public.financeiro enable row level security;
alter table public.configuracoes enable row level security;

drop policy if exists "Acesso livre produtos" on public.produtos;
create policy "Acesso livre produtos" on public.produtos for all using (true) with check (true);

drop policy if exists "Acesso livre movimentacoes" on public.movimentacoes_estoque;
create policy "Acesso livre movimentacoes" on public.movimentacoes_estoque for all using (true) with check (true);

drop policy if exists "Acesso livre vendas" on public.vendas;
create policy "Acesso livre vendas" on public.vendas for all using (true) with check (true);

drop policy if exists "Acesso livre itens_venda" on public.itens_venda;
create policy "Acesso livre itens_venda" on public.itens_venda for all using (true) with check (true);

drop policy if exists "Acesso livre financeiro" on public.financeiro;
create policy "Acesso livre financeiro" on public.financeiro for all using (true) with check (true);

drop policy if exists "Acesso livre configuracoes" on public.configuracoes;
create policy "Acesso livre configuracoes" on public.configuracoes for all using (true) with check (true);
`;
