import {
  CertificationRepository,
  EducationRepository,
} from '@/repositories/education.repository';

export class EducationService {
  private educationRepo = new EducationRepository();
  private certificationRepo = new CertificationRepository();

  async getAll() {
    const education = await this.educationRepo.findAll();
    const certifications = await this.certificationRepo.findAll();

    return { education, certifications };
  }

  async createEducation(data: any) {
    return this.educationRepo.create(data);
  }

  async createCertification(data: any) {
    return this.certificationRepo.create(data);
  }

  async deleteEducation(id: string) {
    return this.educationRepo.softDelete(id);
  }

  async deleteCertification(id: string) {
    return this.certificationRepo.softDelete(id);
  }
}