/**
 * Validação e configuração de variáveis de ambiente
 */

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Variável de ambiente ${key} não está definida`);
  }
  return value;
}

export const env = {
  // Database
  DATABASE_USER: getEnv('DATABASE_USER'),
  DATABASE_HOST: getEnv('DATABASE_HOST'),
  DATABASE_DB: getEnv('DATABASE_DB'),
  DATABASE_PASSWORD: getEnv('DATABASE_PASSWORD'),
  DATABASE_PORT: Number(getEnv('DATABASE_PORT', '5432')),
  
  // JWT
  JWT_SECRET: getEnv('JWT_SECRET', 'change-me-in-production'),
  
  // Server
  PORT: Number(getEnv('PORT', '3000')),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  
  // CORS
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
} as const;

// Validações adicionais
if (env.JWT_SECRET === 'change-me-in-production' && env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET deve ser alterado em produção!');
}
