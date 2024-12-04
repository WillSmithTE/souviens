import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { AppLoadContext } from "@remix-run/cloudflare";

export function getPrisma({ context }: { context: AppLoadContext }) {
  const adapter = new PrismaD1(context.cloudflare.env.DB);
  const prisma = new PrismaClient({ adapter });
  return prisma;
}
export function withDb<T>({
  context,
}: {
  context: AppLoadContext;
}): (callback: (args: { prisma: PrismaClient }) => Promise<T>) => Promise<T> {
  const adapter = new PrismaD1(context.cloudflare.env.DB);
  const prisma = new PrismaClient({ adapter });
  return (callback) => {
    return callback({ prisma });
  };
}
