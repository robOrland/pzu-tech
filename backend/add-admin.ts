import prisma from "./src/db";

async function addAdmin() {
  const email = "admin@govtech.com";
  const password = "admin123";
  const name = "Admin User";

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await Bun.password.hash(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created:", { email, password });
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdmin();