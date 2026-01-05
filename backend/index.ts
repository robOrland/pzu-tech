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

    // Rota para consultar status pelo protocolo (Pública ou Protegida? Vamos manter pública por id, ou protegida se quiser ver MEUS tickets. Mantendo pública por enquanto pela simplicidade do id)
    .get('/:id', async ({ params, set }) => {
      try {
        const ticket = await prisma.ticket.findUnique({
          where: { id: params.id }
        })

        if (!ticket) {
          set.status = 404
          return {
            success: false,
            message: 'Protocolo não encontrado'
          }
        }

        return {
          success: true,
          data: {
            id: ticket.id,
            status: ticket.status,
            category: ticket.category,
            description: ticket.description,
            address: ticket.address,
            createdAt: ticket.createdAt
          }
        }
      } catch (error) {
        console.error(error)
        set.status = 500
        return {
          success: false,
          message: 'Erro ao consultar protocolo'
        }
      }
    }, {
      params: t.Object({
        id: t.String({ format: 'uuid', description: 'Número do protocolo (UUID)' })
      })
    })
  )
  // Área Administrativa
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
      // Verifica se é ADMIN
      if (payload.role !== 'ADMIN') {
        set.status = 403
        throw new Error('Acesso negado: Apenas administradores')
      }
      return { user: payload }
    })
    
    // Atualizar Status do Ticket
    .patch('/tickets/:id/status', async ({ params, body, set }) => {
        try {
            const ticket = await prisma.ticket.update({
                where: { id: params.id },
                data: { status: body.status }
            })
            return { success: true, message: 'Status atualizado', data: ticket }
        } catch (error) {
            set.status = 500
            return { success: false, message: 'Erro ao atualizar status' }
        }
    }, {
        body: t.Object({
            status: t.Enum({ PENDENTE: 'PENDENTE', EM_ANALISE: 'EM_ANALISE', RESOLVIDO: 'RESOLVIDO' })
        })
    })
  )
  .listen(3003);

console.log(
  `🦊 GovTech API is running at ${app.server?.hostname}:${app.server?.port}`
);