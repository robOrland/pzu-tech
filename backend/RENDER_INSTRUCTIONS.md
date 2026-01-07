# Instruções de Deploy no Render

Este backend está configurado para ser implantado usando Docker no Render.

## Variáveis de Ambiente Necessárias

No painel do Render, configure as seguintes variáveis:

1.  **DATABASE_URL**
    *   *Descrição:* String de conexão com o banco de dados PostgreSQL.
    *   *Exemplo:* `postgres://user:password@host:port/dbname` (Use a Internal Database URL se o banco também estiver no Render).

2.  **JWT_SECRET**
    *   *Descrição:* Chave secreta para assinar os tokens de autenticação.
    *   *Valor:* Use uma string longa e aleatória.

3.  **CORS_ORIGIN**
    *   *Descrição:* URL onde seu frontend está hospedado (para permitir requisições).
    *   *Exemplo:* `https://seu-frontend.onrender.com`

## Configurações do Serviço (Render)

*   **Runtime:** Docker
*   **Region:** (Escolha a mesma do seu banco de dados para menor latência)
*   **Branch:** main (ou a branch que você está usando)
*   **Root Directory:** `backend` (Muito importante definir isso, pois o Dockerfile está dentro da pasta backend)

## Scripts e Comandos

O `Dockerfile` já cuida da instalação e inicialização.
*   O comando de start usado é: `bun run start` (que executa `bun run index.ts`).
*   A porta exposta é a `3000`. O Render deve detectar isso automaticamente.
