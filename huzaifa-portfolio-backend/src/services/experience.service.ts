import { ExperienceRepository } from '@/repositories/experience.repository';

export class ExperienceService {
  private repo = new ExperienceRepository();

  async getAll() {
    return this.repo.findAll();
  }

  async create(data: any) {
    return this.repo.create(data);
  }

  async delete(id: string) {
    return this.repo.softDelete(id);
  }
}