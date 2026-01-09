import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { auth } from "./src/auth";
import { ticketsRoutes } from "./src/routes/tickets";
import { adminRoutes } from "./src/routes/admin";
import { errorHandler } from "./src/middleware/errorHandler";
import { rateLimitMiddleware } from "./src/middleware/rateLimit";
import { env } from "./src/config/env";
import { logger } from "./src/utils/logger";
import prisma from "./src/db";

const app = new Elysia()
  // Middleware de tratamento de erros (deve ser o primeiro)
  .use(errorHandler)
  // Rate limiting
  .use(rateLimitMiddleware)
  // CORS
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  // Swagger/OpenAPI
  .use(
    swagger({
      documentation: {
        info: {
          title: "GovTech API",
          version: "1.0.0",
          description: "API para gestão de chamados de infraestrutura urbana",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    })
  )
  // Rotas de autenticação
  .use(auth)
  // Rotas de tickets
  .use(ticketsRoutes)
  // Rotas administrativas
  .use(adminRoutes)
  // Health check melhorado
  .get("/health", async ({ set }: { set: any }) => {
    try {
      // Teste de conexão com banco de dados
      await prisma.$queryRaw`SELECT 1`;
      
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        uptime: process.uptime(),
        environment: env.NODE_ENV,
      };
    } catch (error) {
      set.status = 503;
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })
  .listen({
    port: env.PORT,
    hostname: '0.0.0.0'
  });

logger.info('Servidor iniciado', {
  hostname: app.server?.hostname,
  port: app.server?.port,
  environment: env.NODE_ENV,
});

logger.info('Swagger disponível', {
  url: `http://${app.server?.hostname}:${app.server?.port}/swagger`,
});