# 🏛️ GovTech - Plataforma de Zeladoria Urbana (PZU)

Sistema completo para gestão de chamados de infraestrutura urbana, permitindo que cidadãos registrem problemas e administradores gerenciem e acompanhem a resolução.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## ✨ Características

### Para Cidadãos
- ✅ Cadastro e autenticação de usuários
- ✅ Registro de chamados com categoria, descrição e endereço
- ✅ Acompanhamento do status dos próprios chamados
- ✅ Consulta pública de chamados por protocolo

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Visualização de todos os chamados
- ✅ Atualização de status dos chamados (Pendente, Em Análise, Resolvido)
- ✅ Visualização de informações do cidadão responsável

## 🛠️ Tecnologias

### Backend
- **[Bun](https://bun.sh/)** - Runtime JavaScript/TypeScript
- **[Elysia](https://elysiajs.com/)** - Framework web rápido e type-safe
- **[Prisma](https://www.prisma.io/)** - ORM moderno
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados
- **[JWT](https://jwt.io/)** - Autenticação

### Frontend
- **[React](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis
- **[React Router](https://reactrouter.com/)** - Roteamento
- **[Axios](https://axios-http.com/)** - Cliente HTTP

## 📦 Pré-requisitos

- [Bun](https://bun.sh/) >= 1.0.0
- [Node.js](https://nodejs.org/) >= 18.0.0 (para o frontend)
- PostgreSQL >= 14.0
- npm ou yarn (para o frontend)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd govtech
```

### 2. Configure o Backend

```bash
cd backend

# Instale as dependências
bun install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do banco de dados
```

### 3. Configure o Banco de Dados

```bash
# Gere o cliente Prisma
bun run db:generate

# Execute as migrações
bun run db:migrate

# (Opcional) Crie um usuário administrador
bun run db:seed
```

### 4. Configure o Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env se necessário
```

## ⚙️ Configuração

### Variáveis de Ambiente - Backend

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# Database Configuration
DATABASE_USER=seu_usuario
DATABASE_HOST=seu_host
DATABASE_DB=nome_do_banco
DATABASE_PASSWORD=sua_senha
DATABASE_PORT=5432

# JWT Secret (IMPORTANTE: Altere em produção!)
JWT_SECRET=seu-secret-jwt-super-seguro

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Variáveis de Ambiente - Frontend

Crie um arquivo `.env` na pasta `frontend/` com as seguintes variáveis:

```env
# API Base URL
VITE_API_URL=http://localhost:3000
```

## 🎯 Uso

### Iniciar o Backend

```bash
cd backend
bun run dev
```

O servidor estará rodando em `http://localhost:3000`
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/swagger`
- Health Check: `http://localhost:3000/health`

### Iniciar o Frontend

```bash
cd frontend
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### Credenciais Padrão (Admin)

Após executar `bun run db:seed` no backend:

- **Email:** admin@govtech.com
- **Senha:** admin123

⚠️ **IMPORTANTE:** Altere essas credenciais em produção!

## 📁 Estrutura do Projeto

```
govtech/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (env, etc)
│   │   ├── middleware/      # Middlewares (auth, error handling)
│   │   ├── routes/          # Rotas da API
│   │   ├── auth.ts          # Rotas de autenticação
│   │   └── db.ts            # Configuração do Prisma
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco de dados
│   │   └── migrations/      # Migrações do banco
│   ├── index.ts             # Ponto de entrada
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Componentes React
    │   │   ├── ui/          # Componentes de UI (shadcn/ui)
    │   │   └── AdminRoute.tsx
    │   ├── context/         # Contextos React (Auth)
    │   ├── lib/             # Utilitários e configurações
    │   ├── pages/           # Páginas da aplicação
    │   ├── App.tsx           # Componente principal
    │   └── main.tsx          # Ponto de entrada
    └── package.json
```

## 🔌 API

### Endpoints Principais

#### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login

#### Tickets (Requer autenticação)
- `POST /tickets` - Criar novo chamado
- `GET /tickets` - Listar chamados do usuário logado
- `GET /tickets/:id` - Consultar chamado por ID (público)

#### Admin (Requer role ADMIN)
- `GET /admin/tickets` - Listar todos os chamados
- `PATCH /admin/tickets/:id/status` - Atualizar status do chamado

### Documentação Swagger

Acesse `http://localhost:3000/swagger` para ver a documentação completa da API.

## 🔒 Segurança

- ✅ Senhas hasheadas com Bun.password
- ✅ Autenticação JWT
- ✅ Validação de entrada com Elysia
- ✅ CORS configurado
- ✅ Tratamento de erros padronizado
- ✅ Middleware de autenticação e autorização

## 🧪 Scripts Disponíveis

### Backend
- `bun run dev` - Inicia o servidor em modo desenvolvimento
- `bun run start` - Inicia o servidor em modo produção
- `bun run db:generate` - Gera o cliente Prisma
- `bun run db:migrate` - Executa migrações
- `bun run db:studio` - Abre o Prisma Studio
- `bun run db:seed` - Cria usuário administrador padrão

### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter
- `npm run lint:fix` - Corrige problemas do linter
- `npm run type-check` - Verifica tipos TypeScript

## 🚧 Melhorias Futuras

- [ ] Upload de imagens para os chamados
- [ ] Notificações por email
- [ ] Dashboard com estatísticas
- [ ] Filtros e busca avançada
- [ ] Geolocalização automática
- [ ] Histórico de alterações
- [ ] Comentários nos chamados
- [ ] Exportação de relatórios

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- Seu Nome - [seu-email@exemplo.com]

## 🙏 Agradecimentos

- [Elysia](https://elysiajs.com/) pela excelente framework
- [Prisma](https://www.prisma.io/) pelo ORM poderoso
- [shadcn/ui](https://ui.shadcn.com/) pelos componentes de UI

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
