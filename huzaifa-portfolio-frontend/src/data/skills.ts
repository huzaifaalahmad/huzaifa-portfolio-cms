import { Skill } from '@/types';
export const skillCategories = ['frontend','backend','ai','database','design','automation'];
export const skills: Skill[] = [
  ['React','frontend',95,4,'react',true],['TypeScript','frontend',92,3,'ts',true],['Vite','frontend',88,2,'vite',false],['Node.js','backend',90,4,'node',true],['Express','backend',88,4,'express',false],['Prisma','database',84,2,'prisma',false],['MySQL','database',82,3,'mysql',false],['Prompt Engineering','ai',96,2,'prompt',true],['GPT / Claude','ai',92,2,'llm',true],['Midjourney','ai',90,2,'image',false],['Figma','design',90,4,'figma',false],['Photoshop','design',86,5,'ps',false],['Automation','automation',88,3,'auto',true]
].map((s,i)=>({id:String(i+1),name:{en:s[0] as string, ar:s[0] as string},category:s[1] as string,proficiency:s[2] as number,yearsOfExperience:s[3] as number,icon:s[4] as string,isFeatured:s[5] as boolean,isVisible:true,order:i+1}));
