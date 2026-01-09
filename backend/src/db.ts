import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { env } from './config/env'
import { logger } from './utils/logger'

// Configuração SSL condicional (necessário para serviços cloud, opcional para local)
const sslConfig = env.NODE_ENV === 'production' || env.DATABASE_HOST !== 'localhost'
  ? { rejectUnauthorized: false }
  : false;

const pool = new Pool({
  user: env.DATABASE_USER,
  host: env.DATABASE_HOST,
  database: env.DATABASE_DB,
  password: env.DATABASE_PASSWORD,
  port: env.DATABASE_PORT,
  ssl: sslConfig,
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ 
  adapter,
  log: env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
})

// Graceful shutdown
const shutdown = async () => {
  logger.info('Desconectando do banco de dados...');
  await prisma.$disconnect();
  await pool.end();
  logger.info('Desconexão concluída');
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('beforeExit', shutdown);

// Teste de conexão na inicialização
prisma.$connect()
  .then(() => {
    logger.info('Conexão com banco de dados estabelecida', {
      host: env.DATABASE_HOST,
      database: env.DATABASE_DB,
    });
  })
  .catch((error) => {
    logger.error('Erro ao conectar ao banco de dados', error);
    process.exit(1);
  });

export default prisma