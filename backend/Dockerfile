# Usar a imagem oficial do Bun
FROM oven/bun:latest as base

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Instalar dependências (incluindo devDependencies para o prisma generate funcionar corretamente se necessário, ou usar --production se for otimizado)
# Como precisamos do prisma CLI para gerar o cliente, é seguro instalar tudo e depois podar se quisermos multi-stage, mas vamos manter simples.
RUN bun install --frozen-lockfile

# Gerar o Prisma Client
RUN bunx prisma generate

# Copiar o código fonte restante
COPY . .

# Expor a porta que a aplicação usa
EXPOSE 3000

# Definir variáveis de ambiente padrão (podem ser sobrescritas no deploy)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar a aplicação
CMD ["bun", "run", "start"]
