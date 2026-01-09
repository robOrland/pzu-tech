import { Elysia, t } from "elysia";
import prisma from "../db";
import { adminMiddleware } from "../middleware/auth";
import { logger } from "../utils/logger";

export const adminRoutes = new Elysia()
  .use(adminMiddleware)
  .group("/admin", (app) =>
    app
      // Listar todos os chamados
      .get("/tickets", async () => {
        const tickets = await prisma.ticket.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
        return { success: true, data: tickets };
      })
      // Atualizar status do chamado
      .patch(
        "/tickets/:id/status",
        async ({ params, body, user }) => {
          // Verificar se o ticket existe
          const existingTicket = await prisma.ticket.findUnique({
            where: { id: params.id },
          });

          if (!existingTicket) {
            throw new Error("Chamado não encontrado");
          }

          const ticket = await prisma.ticket.update({
            where: { id: params.id },
            data: { status: body.status },
          });

          logger.info('Status do ticket atualizado', {
            ticketId: ticket.id,
            newStatus: ticket.status,
            adminId: user.id,
          });

          return {
            success: true,
            message: "Status atualizado com sucesso",
            data: ticket,
          };
        },
        {
          body: t.Object({
            status: t.Enum({
              PENDENTE: "PENDENTE",
              EM_ANALISE: "EM_ANALISE",
              RESOLVIDO: "RESOLVIDO",
            }),
          }),
        }
      )
  );
