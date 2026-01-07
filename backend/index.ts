import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import prisma from "./src/db";
import { auth } from "./src/auth";

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'GovTech API',
        version: '1.0.0',
        description: 'API para gestão de chamados de infraestrutura urbana'
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }))
  .use(auth) // Adiciona rotas de autenticação (/auth/register, /auth/login)
  .group('/tickets', (app) => app
    // Protege rotas de tickets (usuário deve estar logado)
    .derive(async ({ jwt, headers, set }) => {
      const authHeader = headers['authorization']
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401
        throw new Error('Não autorizado: Token não fornecido')
      }
      
      const token = authHeader.split(' ')[1]
      const payload = await jwt.verify(token)
      
      if (!payload) {
        set.status = 401
        throw new Error('Não autorizado: Token inválido')
      }
      
      return {
        user: payload
      }
    })
    
    // Rota para criar um novo chamado (Cidadão Logado)
    .post('/', async ({ body, set, user }) => {
      try {
        const ticket = await prisma.ticket.create({
          data: {
            category: body.category,
            description: body.description,
            address: body.address,
            photoUrl: body.photoUrl,
            userId: user.id as string // Vincula ao usuário logado
          }
        })
        
        set.status = 201
        return {
          success: true,
          protocol: ticket.id,
          message: 'Chamado registrado com sucesso'
        }
      } catch (error) {
        console.error(error)
        set.status = 500
        return {
          success: false,
          message: 'Erro ao registrar chamado'
        }
      }
    }, {
      body: t.Object({
        category: t.String({ minLength: 3, description: 'Categoria do problema (ex: Buraco, Iluminação)' }),
        description: t.String({ minLength: 10, description: 'Descrição detalhada do problema' }),
        address: t.String({ minLength: 5, description: 'Endereço manual da ocorrência' }),
        photoUrl: t.Optional(t.String({ description: 'URL ou Base64 da foto anexada' }))
      })
    })

    // Rota para o cidadão logado ver seus próprios tickets
    .get('/', async ({ user, set }) => {
      try {
        const tickets = await prisma.ticket.findMany({
          where: { userId: user.id as string },
          orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: tickets };
      } catch (error) {
        set.status = 500;
        return { success: false, message: 'Erro ao buscar chamados' };
      }
    })
    // Rota para consultar status pelo protocolo (Pública)
    .get('/:id', async ({ params, set }) => {
      try {
        const ticket = await prisma.ticket.findUnique({
          where: { id: params.id }
        })

        if (!ticket) {
          set.status = 404
          return { success: false, message: 'Chamado não encontrado' }
        }

        return { success: true, data: ticket }
      } catch (error) {
        set.status = 500
        return { success: false, message: 'Erro ao buscar chamado' }
      }
    })
  )
  .group('/admin', (app) => app
    .derive(async ({ jwt, headers, set }) => {
      const authHeader = headers['authorization']
      if (!authHeader?.startsWith('Bearer ')) {
        set.status = 401
        throw new Error('Não autorizado')
      }
      
      const token = authHeader.split(' ')[1]
      const payload = await jwt.verify(token)
      
      if (!payload) {
        set.status = 401
        throw new Error('Token inválido')
      }

      if (payload.role !== 'ADMIN') {
        set.status = 403
        throw new Error('Acesso negado: Apenas administradores')
      }
      
      return {
        user: payload
      }
    })
    // Listar todos os chamados
    .get('/tickets', async ({ set }) => {
      try {
        const tickets = await prisma.ticket.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        })
        return { success: true, data: tickets }
      } catch (error) {
        console.error(error)
        set.status = 500
        return { success: false, message: 'Erro ao listar chamados' }
      }
    })
    // Atualizar status do chamado
    .patch('/tickets/:id/status', async ({ params, body, set }) => {
      try {
        const { status } = body
        const ticket = await prisma.ticket.update({
          where: { id: params.id },
          data: { status }
        })
        return { success: true, message: 'Status atualizado com sucesso', data: ticket }
      } catch (error) {
        console.error(error)
        set.status = 500
        return { success: false, message: 'Erro ao atualizar status' }
      }
    }, {
      body: t.Object({
        status: t.Enum({
          PENDENTE: 'PENDENTE',
          EM_ANALISE: 'EM_ANALISE',
          RESOLVIDO: 'RESOLVIDO'
        })
      })
    })
  )
  .listen(3000);

console.log(
  `🦊 GovTech API is running at ${app.server?.hostname}:${app.server?.port}`
);