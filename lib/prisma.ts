import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

const runtime = globalThis as typeof globalThis & {
  process?: { env?: { NODE_ENV?: string } }
}

if (runtime.process?.env?.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma