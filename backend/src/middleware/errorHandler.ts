import { Elysia } from "elysia";
import { env } from "../config/env";

/**
 * Middleware global de tratamento de erros
 */
export const errorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    // Log do erro (em produção, usar um logger adequado)
    if (env.NODE_ENV === 'development') {
      console.error('Error:', {
        code,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Error:', {
        code,
        message: error.message,
      });
    }

    // Se o status já foi definido, usar ele
    if (set.status) {
      return {
        success: false,
        message: error.message || 'Erro interno do servidor',
      };
    }

    // Tratamento de erros comuns
    switch (code) {
      case 'VALIDATION':
        set.status = 400;
        return {
          success: false,
          message: 'Dados inválidos',
          errors: error.message,
        };
      case 'NOT_FOUND':
        set.status = 404;
        return {
          success: false,
          message: error.message || 'Recurso não encontrado',
        };
      case 'UNAUTHORIZED':
        set.status = 401;
        return {
          success: false,
          message: error.message || 'Não autorizado',
        };
      case 'FORBIDDEN':
        set.status = 403;
        return {
          success: false,
          message: error.message || 'Acesso negado',
        };
      default:
        set.status = 500;
        return {
          success: false,
          message: env.NODE_ENV === 'development' 
            ? error.message 
            : 'Erro interno do servidor',
        };
    }
  });
