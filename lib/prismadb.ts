import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}
 //PrismaClient instance
 //develop時にhot reloadを有効にするため、globalに保存
const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') globalThis.prisma = prismadb;

export default prismadb;
