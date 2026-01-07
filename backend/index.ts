import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { auth } from "./src/auth";
import { ticketsRoutes } from "./src/routes/tickets";
import { adminRoutes } from "./src/routes/admin";
import { errorHandler } from "./src/middleware/errorHandler";
import { env } from "./src/config/env";

const app = new Elysia()
  // Middleware de tratamento de erros (deve ser o primeiro)
  .use(errorHandler)
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
  // Health check
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .listen(env.PORT);

console.log(
  `🦊 GovTech API is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📚 Swagger documentation: http://${app.server?.hostname}:${app.server?.port}/swagger`);