import{PrismaClient}from'@prisma/client';
class D{private static i:PrismaClient;public static getInstance(){if(!D.i)D.i=new PrismaClient();return D.i;}}
export const prisma=D.getInstance();
