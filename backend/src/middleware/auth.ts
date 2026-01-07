import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "../config/env";

/**
 * Middleware de autenticação JWT
 */
export const authMiddleware = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET,
    })
  )
  .derive(async ({ jwt, headers, set }) => {
    const authHeader = headers['authorization'];
    
    if (!authHeader?.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Não autorizado: Token não fornecido');
    }
    
    const token = authHeader.split(' ')[1];
    const payload = await jwt.verify(token);
    
    if (!payload) {
      set.status = 401;
      throw new Error('Não autorizado: Token inválido');
    }
    
    return {
      user: payload as { id: string; role: string };
    };
  });

/**
 * Middleware de autenticação para administradores
 */
export const adminMiddleware = new Elysia()
  .use(authMiddleware)
  .derive(async ({ user, set }) => {
    if (user.role !== 'ADMIN') {
      set.status = 403;
      throw new Error('Acesso negado: Apenas administradores');
    }
    
    return { user };
  });
