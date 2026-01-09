import { Elysia } from "elysia";
import { rateLimiter, authRateLimiter } from "../utils/rateLimiter";
import { logger } from "../utils/logger";

/**
 * Middleware de rate limiting geral
 */
export const rateLimitMiddleware = new Elysia()
  .derive(async ({ request, set }) => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const result = rateLimiter.check(ip);

    if (!result.allowed) {
      logger.warn('Rate limit excedido', { ip, resetTime: result.resetTime });
      set.status = 429;
      set.headers['X-RateLimit-Limit'] = '100';
      set.headers['X-RateLimit-Remaining'] = '0';
      set.headers['X-RateLimit-Reset'] = new Date(result.resetTime).toISOString();
      throw new Error('Muitas requisições. Tente novamente mais tarde.');
    }

    set.headers['X-RateLimit-Limit'] = '100';
    set.headers['X-RateLimit-Remaining'] = result.remaining.toString();
    set.headers['X-RateLimit-Reset'] = new Date(result.resetTime).toISOString();

    return {};
  });

/**
 * Middleware de rate limiting para autenticação (mais restritivo)
 */
export const authRateLimitMiddleware = new Elysia()
  .derive(async ({ request, set }) => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const result = authRateLimiter.check(ip);

    if (!result.allowed) {
      logger.warn('Rate limit de autenticação excedido', { ip, resetTime: result.resetTime });
      set.status = 429;
      set.headers['X-RateLimit-Limit'] = '5';
      set.headers['X-RateLimit-Remaining'] = '0';
      set.headers['X-RateLimit-Reset'] = new Date(result.resetTime).toISOString();
      throw new Error('Muitas tentativas de login. Aguarde alguns minutos.');
    }

    set.headers['X-RateLimit-Limit'] = '5';
    set.headers['X-RateLimit-Remaining'] = result.remaining.toString();
    set.headers['X-RateLimit-Reset'] = new Date(result.resetTime).toISOString();

    return {};
  });
