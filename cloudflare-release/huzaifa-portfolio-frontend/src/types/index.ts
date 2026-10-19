export type Lang = 'en' | 'ar';
export type BilingualText = { en: string; ar: string };
export type VisibilityFlags = { isVisible: boolean; isFeatured?: boolean; order: number };
export interface Profile { name: string; title: BilingualText; tagline: BilingualText; bio: BilingualText; email: string; phone: string; location: BilingualText; cvUrl: string; }
export interface Stat extends VisibilityFlags { id: string; label: BilingualText; value: number; suffix?: string; }
export interface Service extends VisibilityFlags { id: string; title: BilingualText; description: BilingualText; icon: string; features: BilingualText[]; }
export interface Skill extends VisibilityFlags { id: string; name: BilingualText; category: string; proficiency: number; yearsOfExperience: number; icon: string; }
export interface Experience extends VisibilityFlags { id: string; company: BilingualText; role: BilingualText; location: BilingualText; employmentType: string; startDate: string; endDate?: string; isCurrent: boolean; description: BilingualText; achievements: BilingualText[]; technologies: string[]; }
export interface Education extends VisibilityFlags { id: string; institution: BilingualText; degree: BilingualText; field: BilingualText; location: BilingualText; startDate: string; endDate?: string; achievements: BilingualText[]; }
export interface Certification extends VisibilityFlags { id: string; name: BilingualText; issuer: BilingualText; issueDate: string; credentialUrl?: string; }
export interface Project extends VisibilityFlags { id: string; slug: string; title: BilingualText; shortDescription: BilingualText; fullDescription: BilingualText; category: string; role: BilingualText; technologies: string[]; features: BilingualText[]; challenge: BilingualText; solution: BilingualText; impact: BilingualText; liveUrl?: string; githubUrl?: string; }
export interface Testimonial extends VisibilityFlags { id: string; clientName: BilingualText; clientRole: BilingualText; clientCompany: BilingualText; text: BilingualText; rating: number; projectId?: string; }
export interface SocialLink extends VisibilityFlags { id: string; platform: string; url: string; icon: string; }
export interface ContactFormData { name: string; email: string; phone?: string; subject: string; message: string; preferredLanguage: Lang; }
