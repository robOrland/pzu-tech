-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDENTE', 'EM_ANALISE', 'RESOLVIDO');

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT,
    "address" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);
