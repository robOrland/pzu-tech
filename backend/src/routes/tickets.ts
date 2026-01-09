import { Elysia, t } from "elysia";
import prisma from "../db";
import { authMiddleware } from "../middleware/auth";

// Rota pública para consultar ticket por ID
const publicTicketRoute = new Elysia().get(
  "/tickets/:id",
  async ({ params, set }) => {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
    });

    if (!ticket) {
      set.status = 404;
      throw new Error("Chamado não encontrado");
    }

    return { success: true, data: ticket };
  }
);

// Rotas protegidas de tickets
const protectedTicketsRoutes = new Elysia()
  .use(authMiddleware)
  .group("/tickets", (app) =>
    app
      // Criar um novo chamado (Cidadão Logado)
      .post(
        "/",
        async ({ body, set, ...context }) => {
          const user = (context as any).user;
          const ticket = await prisma.ticket.create({
            data: {
              category: body.category,
              description: body.description,
              address: body.address,
              photoUrl: body.photoUrl,
              userId: user.id,
            },
          });

          set.status = 201;
          return {
            success: true,
            protocol: ticket.id,
            message: "Chamado registrado com sucesso",
          };
        },
        {
          body: t.Object({
            category: t.String({
              minLength: 3,
              description: "Categoria do problema (ex: Buraco, Iluminação)",
            }),
            description: t.String({
              minLength: 10,
              description: "Descrição detalhada do problema",
            }),
            address: t.String({
              minLength: 5,
              description: "Endereço manual da ocorrência",
            }),
            photoUrl: t.Optional(
              t.String({ description: "URL ou Base64 da foto anexada" })
            ),
          }),
        }
      )
      // Listar tickets do usuário logado
      .get("/", async (context) => {
        const user = (context as any).user;
        const tickets = await prisma.ticket.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        });
        return { success: true, data: tickets };
      })
  );

// Exporta as rotas combinadas
export const ticketsRoutes = new Elysia()
  .use(publicTicketRoute)
  .use(protectedTicketsRoutes);
