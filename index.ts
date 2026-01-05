import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import prisma from "./src/db";

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: 'GovTech API',
        version: '1.0.0',
        description: 'API para gestão de chamados de infraestrutura urbana'
      }
    }
  }))
  .group('/tickets', (app) => app
    // Rota para criar um novo chamado
    .post('/', async ({ body, set }) => {
      try {
        const ticket = await prisma.ticket.create({
          data: {
            category: body.category,
            description: body.description,
            address: body.address,
            photoUrl: body.photoUrl,
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

    // Rota para consultar status pelo protocolo
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
  .listen(3002);

console.log(
  `🦊 GovTech API is running at ${app.server?.hostname}:${app.server?.port}`
);