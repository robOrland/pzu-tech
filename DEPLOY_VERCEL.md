# 🚀 Guia de Deploy no Vercel

Este guia explica como fazer deploy do sistema GovTech no Vercel.

## ⚠️ Importante sobre Vercel e Docker

O Vercel **não usa Docker** para deploy. Ele detecta automaticamente projetos Node.js, React, Next.js, etc. e faz o build automaticamente.

## 📋 Opções de Deploy

### Opção 1: Frontend no Vercel + Backend em outro serviço (Recomendado)

O Vercel é otimizado para frontends estáticos e serverless functions. Para o backend Bun, recomenda-se usar outro serviço.

#### Frontend no Vercel

1. **Instale a CLI do Vercel:**
```bash
npm i -g vercel
```

2. **Configure o projeto:**
```bash
cd frontend
vercel
```

3. **Configure as variáveis de ambiente no dashboard do Vercel:**
   - `VITE_API_URL`: URL do seu backend (ex: `https://seu-backend.herokuapp.com`)

4. **Deploy:**
```bash
vercel --prod
```

#### Backend em outro serviço

Para o backend Bun, considere:
- **Railway** (https://railway.app) - Suporta Bun nativamente
- **Fly.io** (https://fly.io) - Suporta Docker
- **Render** (https://render.com) - Suporta Docker
- **Heroku** (com buildpack customizado)

### Opção 2: Usar Docker no Railway/Fly.io/Render

Se você quiser usar Docker, pode fazer deploy em serviços que suportam Docker:

#### Railway

1. Conecte seu repositório GitHub
2. Railway detecta automaticamente o `docker-compose.yml`
3. Configure as variáveis de ambiente
4. Deploy automático

#### Fly.io

1. Instale a CLI: `npm i -g @fly/cli`
2. Login: `fly auth login`
3. Crie app: `fly launch`
4. Configure variáveis: `fly secrets set KEY=value`
5. Deploy: `fly deploy`

#### Render

1. Conecte repositório GitHub
2. Selecione "Web Service"
3. Configure:
   - Build Command: `docker build -t govtech-backend ./backend`
   - Start Command: `docker run -p 3000:3000 govtech-backend`
4. Configure variáveis de ambiente
5. Deploy

### Opção 3: Frontend e Backend separados

#### Frontend (Vercel)
- Deploy automático do React/Vite
- Configure `VITE_API_URL` apontando para o backend

#### Backend (Railway/Fly.io/Render)
- Use Docker ou deploy direto com Bun
- Configure CORS para aceitar o domínio do Vercel

## 🔧 Configuração Recomendada

### 1. Frontend no Vercel

Crie `vercel.json` na raiz do projeto:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "devCommand": "cd frontend && npm run dev",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

Ou configure diretamente no dashboard do Vercel.

### 2. Backend no Railway (Recomendado para Bun)

1. Crie `railway.json` na pasta `backend/`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "bun run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Conecte o repositório no Railway
3. Configure variáveis de ambiente
4. Railway fará o deploy automaticamente

### 3. Banco de Dados

Para produção, use um serviço gerenciado:
- **Supabase** (https://supabase.com) - PostgreSQL gratuito
- **Neon** (https://neon.tech) - PostgreSQL serverless
- **Railway PostgreSQL** - Banco gerenciado
- **AWS RDS** - Para projetos maiores

## 📝 Variáveis de Ambiente

### Frontend (Vercel)
- `VITE_API_URL`: URL do backend em produção

### Backend (Railway/Fly.io/Render)
- `DATABASE_USER`: Usuário do banco
- `DATABASE_HOST`: Host do banco
- `DATABASE_DB`: Nome do banco
- `DATABASE_PASSWORD`: Senha do banco
- `DATABASE_PORT`: Porta (geralmente 5432)
- `JWT_SECRET`: Secret JWT forte
- `PORT`: Porta do servidor (geralmente definida pelo serviço)
- `NODE_ENV`: `production`
- `CORS_ORIGIN`: URL do frontend no Vercel

## 🚀 Passo a Passo Completo

### 1. Preparar Banco de Dados

1. Crie uma conta no Supabase ou Neon
2. Crie um novo projeto PostgreSQL
3. Anote as credenciais de conexão

### 2. Deploy do Backend

#### Opção A: Railway
```bash
# Instale Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicialize projeto
cd backend
railway init

# Configure variáveis
railway variables set DATABASE_USER=seu_usuario
railway variables set DATABASE_HOST=seu_host
# ... outras variáveis

# Deploy
railway up
```

#### Opção B: Fly.io
```bash
# Instale Fly CLI
npm i -g @fly/cli

# Login
fly auth login

# Crie app
cd backend
fly launch

# Configure secrets
fly secrets set DATABASE_USER=seu_usuario
fly secrets set DATABASE_HOST=seu_host
# ... outras variáveis

# Deploy
fly deploy
```

### 3. Deploy do Frontend

```bash
# Instale Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Configure variáveis no dashboard ou via CLI
vercel env add VITE_API_URL

# Deploy em produção
vercel --prod
```

### 4. Configurar CORS

No backend, certifique-se de que `CORS_ORIGIN` está configurado com a URL do frontend no Vercel:
```
CORS_ORIGIN=https://seu-app.vercel.app
```

## 🔍 Verificação

1. ✅ Backend respondendo em `/health`
2. ✅ Frontend acessível
3. ✅ CORS configurado corretamente
4. ✅ Banco de dados conectado
5. ✅ Migrações executadas

## 📚 Recursos

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Railway](https://docs.railway.app)
- [Documentação Fly.io](https://fly.io/docs)
- [Documentação Render](https://render.com/docs)

## ⚠️ Notas Importantes

1. **Bun no Vercel**: Vercel não suporta Bun nativamente. Use Railway, Fly.io ou Render para o backend.

2. **Serverless Functions**: Se quiser usar Vercel para o backend, precisaria converter para Node.js e usar serverless functions, o que requer refatoração significativa.

3. **Banco de Dados**: Use sempre um serviço gerenciado em produção. Não use containers Docker para banco de dados em produção.

4. **Variáveis Sensíveis**: Nunca commite secrets. Use sempre variáveis de ambiente do serviço de deploy.
