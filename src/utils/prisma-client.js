require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

let prisma;

const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

const disconnectPrisma = async () => {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
};

module.exports = { getPrismaClient, disconnectPrisma };
