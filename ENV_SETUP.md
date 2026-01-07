# Configuração de Variáveis de Ambiente

Este arquivo contém instruções para configurar as variáveis de ambiente do projeto.

## Backend

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
# Database Configuration
DATABASE_USER=seu_usuario
DATABASE_HOST=seu_host
DATABASE_DB=nome_do_banco
DATABASE_PASSWORD=sua_senha
DATABASE_PORT=5432

# JWT Secret (IMPORTANTE: Altere em produção!)
JWT_SECRET=seu-secret-jwt-super-seguro-aleatorio

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Notas importantes:

- **JWT_SECRET**: Deve ser uma string aleatória e segura. Em produção, use um gerador de secrets forte.
- **DATABASE_PORT**: Padrão é 5432 para PostgreSQL.
- **CORS_ORIGIN**: Deve corresponder à URL do frontend. Em produção, ajuste para o domínio correto.

## Frontend

Crie um arquivo `.env` na pasta `frontend/` com o seguinte conteúdo:

```env
# API Base URL
VITE_API_URL=http://localhost:3000
```

### Notas importantes:

- **VITE_API_URL**: URL base da API backend. Em produção, ajuste para o domínio do backend.
- Variáveis no Vite devem começar com `VITE_` para serem expostas ao código do cliente.

## Exemplo de .env.example

Você pode criar arquivos `.env.example` (sem valores sensíveis) para servir como template:

### backend/.env.example
```env
DATABASE_USER=your_database_user
DATABASE_HOST=your_database_host
DATABASE_DB=your_database_name
DATABASE_PASSWORD=your_database_password
DATABASE_PORT=5432

JWT_SECRET=change-me-in-production-use-strong-random-secret

PORT=3000
NODE_ENV=development

CORS_ORIGIN=http://localhost:5173
```

### frontend/.env.example
```env
VITE_API_URL=http://localhost:3000
```

## Segurança

⚠️ **IMPORTANTE:**
- Nunca commite arquivos `.env` no Git
- Use `.env.example` como template
- Em produção, use variáveis de ambiente do sistema ou serviços de gerenciamento de secrets
- Gere secrets fortes e únicos para cada ambiente
