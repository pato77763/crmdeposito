# 🍺 Diego Bebidas - CRM & Gestão Comercial

Sistema completo de gestão comercial, controle de depósito e estoque, PDV (frente de caixa), fluxo financeiro e integrações com **Supabase** para distribuidoras de bebidas.

---

## 🚀 Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 6** (Build ultrarrápido)
- **Tailwind CSS v4**
- **Supabase** (Autenticação Auth, Tabelas PostgreSQL e RPC `processar_venda_pdv`)
- **Lucide React** (Ícones modernos)

---

## 📦 Como Subir para o GitHub (Passo a Passo)

### 1. Iniciar o repositório Git localmente
No terminal do seu computador (dentro da pasta do projeto):

```bash
git init
git add .
git commit -m "feat: CRM Diego Bebidas pronto para produção com Supabase"
```

### 2. Criar o repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Dê o nome ao repositório (exemplo: `diego-bebidas-crm`).
3. Escolha **Public** ou **Private**.
4. Clique em **Create repository** (não marque README nem .gitignore, pois já estão criados no projeto).

### 3. Conectar e enviar o código para o GitHub
Execute os comandos indicados na tela do GitHub (substituindo pelo seu usuário):

```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/diego-bebidas-crm.git
git push -u origin main
```

---

## ⚡ Como Publicar na Vercel (Passo a Passo)

### 1. Conectar a Vercel ao GitHub
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. No painel principal (Dashboard), clique no botão **"Add New..."** ➔ **"Project"**.
3. Na lista de repositórios, localize `diego-bebidas-crm` e clique em **"Import"**.

### 2. Configurações do Projeto
A Vercel detectará automaticamente o framework como **Vite**:
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (padrão)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Variáveis de Ambiente (Environment Variables)
No campo **Environment Variables**, adicione as seguintes chaves (opcional, já há fallback integrado):

| Nome | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://jxsavpadnkktqcrvvngq.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4c2F2cGFkbmtrdHFjcnZ2bmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5MTQ3MzEsImV4cCI6MjEwNjQ5MDczMX0.UWeepyDiS2Ze9Kl7MyJlCG9E44jdxmy3kSGdoPMTSzM` |

### 4. Deploy
Clique no botão **"Deploy"**.
Em menos de 1 minuto, seu site estará no ar com link público HTTPS fornecido pela Vercel!

---

## 🔐 Acesso Administrativo

- **Acesso à Tela de Login**: Clique no pontinho discreto no canto superior direito da tela inicial.
- **E-mail**: `diegobebidas@gmail.com`
- **Senha**: `diego2026`
