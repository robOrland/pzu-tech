import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import prisma from "./db";

export const auth = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "segredo-super-secreto-mudeme-em-producao",
    })
  )
  .group("/auth", (app) =>
    app
      .post(
        "/register",
        async ({ body, set }) => {
          try {
            const { name, email, password } = body;

            // Verificar se usuário já existe
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });

            if (existingUser) {
              set.status = 400;
              return { success: false, message: "Email já cadastrado" };
            }

            // Hash da senha (nativo do Bun)
            const hashedPassword = await Bun.password.hash(password);

            // Criar usuário (padrão CITIZEN)
            const user = await prisma.user.create({
              data: {
                name,
                email,
                password: hashedPassword,
                role: "CITIZEN",
              },
            });

            return {
              success: true,
              message: "Usuário cadastrado com sucesso",
              userId: user.id,
            };
          } catch (error) {
            console.error(error);
            set.status = 500;
            return { success: false, message: "Erro ao registrar usuário" };
          }
        },
        {
          body: t.Object({
            name: t.String({ minLength: 3 }),
            email: t.String({ format: "email" }),
            password: t.String({ minLength: 6 }),
          }),
        }
      )
      .post(
        "/login",
        async ({ body, jwt, set }) => {
          try {
            const { email, password } = body;

            const user = await prisma.user.findUnique({
              where: { email },
            });

            if (!user) {
              set.status = 401;
              return { success: false, message: "Credenciais inválidas" };
            }

            const isMatch = await Bun.password.verify(password, user.password);

            if (!isMatch) {
              set.status = 401;
              return { success: false, message: "Credenciais inválidas" };
            }

            // Gerar Token
            const token = await jwt.sign({
              id: user.id,
              role: user.role,
            });

            return {
              success: true,
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
            };
          } catch (error) {
            console.error(error);
            set.status = 500;
            return { success: false, message: "Erro ao realizar login" };
          }
        },
        {
          body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String(),
          }),
        }
      )
  );