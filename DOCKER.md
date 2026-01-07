# 🐳 Guia de Uso do Docker

Este guia explica como usar Docker para rodar o sistema GovTech localmente.

## 📋 Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## 🚀 Início Rápido

### 1. Configure as variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações.

### 2. Inicie todos os serviços

```bash
docker-compose up -d
```

Este comando irá:
- ✅ Criar e iniciar o banco de dados PostgreSQL
- ✅ Construir e iniciar o backend
- ✅ Construir e iniciar o frontend
- ✅ Executar migrações do banco de dados automaticamente

### 3. Acesse a aplicação

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Swagger**: http://localhost:3000/swagger
- **Health Check**: http://localhost:3000/health

## 📝 Comandos Úteis

### Ver logs
```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas banco de dados
docker-compose logs -f postgres
```

### Parar os serviços
```bash
docker-compose down
```

### Parar e remover volumes (⚠️ apaga dados do banco)
```bash
docker-compose down -v
```

### Reconstruir as imagens
```bash
docker-compose build --no-cache
```

### Reiniciar um serviço específico
```bash
docker-compose restart backend
```

### Executar comandos dentro de um container

#### Backend
```bash
# Acessar shell do backend
docker-compose exec backend sh

# Executar migrações
docker-compose exec backend bun run db:migrate

# Criar usuário admin
docker-compose exec backend bun run db:seed

# Abrir Prisma Studio
docker-compose exec backend bun run db:studio
```

#### Banco de Dados
```bash
# Acessar PostgreSQL
docker-compose exec postgres psql -U postgres -d govtech
```

## 🔧 Desenvolvimento

### Modo desenvolvimento com hot-reload

Para desenvolvimento com hot-reload, você pode usar os seguintes comandos:

#### Backend (fora do Docker)
```bash
cd backend
bun install
bun run dev
```

#### Frontend (fora do Docker)
```bash
cd frontend
npm install
npm run dev
```

#### Apenas banco de dados no Docker
```bash
docker-compose up -d postgres
```

## 🗄️ Banco de Dados

### Backup do banco de dados
```bash
docker-compose exec postgres pg_dump -U postgres govtech > backup.sql
```

### Restaurar backup
```bash
docker-compose exec -T postgres psql -U postgres govtech < backup.sql
```

### Resetar banco de dados
```bash
# Parar serviços
docker-compose down

# Remover volume do banco
docker volume rm govtech_postgres_data

# Iniciar novamente
docker-compose up -d
```

## 🐛 Troubleshooting

### Porta já em uso

Se a porta 3000 ou 5432 já estiver em uso:

1. Pare o serviço que está usando a porta
2. Ou altere as portas no `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Mude 3000 para 3001
```

### Erro de conexão com banco de dados

1. Verifique se o PostgreSQL está rodando:
```bash
docker-compose ps
```

2. Verifique os logs:
```bash
docker-compose logs postgres
```

3. Aguarde alguns segundos após iniciar - o banco precisa de tempo para inicializar

### Erro de permissão

No Linux/Mac, pode ser necessário usar `sudo`:
```bash
sudo docker-compose up -d
```

### Limpar tudo e começar do zero

```bash
# Parar e remover tudo
docker-compose down -v

# Remover imagens
docker-compose down --rmi all

# Limpar sistema Docker (cuidado!)
docker system prune -a
```

## 📊 Monitoramento

### Ver uso de recursos
```bash
docker stats
```

### Ver status dos containers
```bash
docker-compose ps
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: Os arquivos Docker são para desenvolvimento local. Para produção:

1. Use secrets do Docker ou variáveis de ambiente seguras
2. Não commite arquivos `.env` com credenciais reais
3. Use serviços gerenciados de banco de dados em produção
4. Configure firewall e regras de rede adequadas
5. Use HTTPS em produção

## 📚 Estrutura dos Arquivos Docker

- `backend/Dockerfile` - Imagem do backend (Bun)
- `frontend/Dockerfile` - Imagem do frontend (React + Nginx)
- `docker-compose.yml` - Orquestração de todos os serviços
- `.dockerignore` - Arquivos ignorados no build
- `.env.example` - Exemplo de variáveis de ambiente

## 🆘 Ajuda

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs`
2. Verifique se as portas estão livres
3. Verifique as variáveis de ambiente no `.env`
4. Tente reconstruir as imagens: `docker-compose build --no-cache`
