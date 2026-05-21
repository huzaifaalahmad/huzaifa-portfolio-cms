import { Skill } from '@/types';

const rows: Array<[string, string, number, number, string, boolean]> = [
  ['Adobe Photoshop', 'design', 95, 4, 'photoshop', true],
  ['Adobe Illustrator', 'design', 94, 4, 'illustrator', true],
  ['Premiere Pro', 'motion', 88, 3, 'premiere', true],
  ['Adobe InDesign', 'production', 86, 3, 'indesign', false],
  ['Figma', 'design', 90, 4, 'figma', true],
  ['HTML5 / CSS3', 'frontend', 92, 4, 'html-css', true],
  ['JavaScript', 'frontend', 88, 3, 'javascript', true],
  ['React.js', 'frontend', 86, 3, 'react', true],
  ['Tailwind CSS', 'frontend', 84, 2, 'tailwind', false],
  ['Prompt Engineering', 'ai', 94, 3, 'prompt', true],
  ['Adobe Firefly', 'ai', 88, 2, 'firefly', true],
  ['Generative AI', 'ai', 90, 2, 'generative-ai', true],
  ['Brand Guidelines', 'branding', 92, 4, 'brand-guidelines', true],
  ['Typography', 'branding', 90, 4, 'typography', true],
  ['Color Theory', 'branding', 90, 4, 'color-theory', true],
  ['Packaging Design', 'production', 84, 3, 'packaging', false],
  ['Print Production', 'production', 86, 3, 'print', false],
  ['Digital Advertising', 'marketing', 88, 3, 'ads', true],
  ['Content Strategy', 'marketing', 86, 3, 'content', true],
  ['SEO Basics', 'analytics', 76, 2, 'seo', false],
  ['Microsoft Office', 'office', 86, 5, 'office', false],
  ['A/B Testing', 'analytics', 78, 2, 'ab-testing', false],
  ['Responsive Design', 'frontend', 90, 4, 'responsive', true],
  ['Motion Graphics', 'motion', 84, 3, 'motion', true],
];

export const skillCategories = [
  'design',
  'frontend',
  'ai',
  'branding',
  'production',
  'marketing',
  'analytics',
  'office',
  'motion',
];

export const skills: Skill[] = rows.map((skill, index) => ({
  id: String(index + 1),
  name: { en: skill[0], ar: skill[0] },
  category: skill[1],
  proficiency: skill[2],
  yearsOfExperience: skill[3],
  icon: skill[4],
  isFeatured: skill[5],
  isVisible: true,
  order: index + 1,
}));
