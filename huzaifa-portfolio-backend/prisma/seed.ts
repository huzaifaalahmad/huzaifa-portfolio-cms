import{PrismaClient}from'@prisma/client';import bcrypt from'bcryptjs';
const p=new PrismaClient();
async function main(){
const h=await bcrypt.hash(process.env.ADMIN_PASSWORD||'Admin@123456',10);
await p.user.upsert({where:{email:process.env.ADMIN_EMAIL||'admin@example.com'},update:{},create:{email:process.env.ADMIN_EMAIL||'admin@example.com',passwordHash:h,name:'Admin',role:'ADMIN',isActive:true}});
console.log('✅ Seeded');}
main().finally(()=>p.$disconnect());
