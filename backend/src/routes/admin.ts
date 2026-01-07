import { Elysia, t } from "elysia";
import prisma from "../db";
import { adminMiddleware } from "../middleware/auth";

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
        async ({ params, body }) => {
          const ticket = await prisma.ticket.update({
            where: { id: params.id },
            data: { status: body.status },
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
