import { SkillRepository } from '@/repositories/skill.repository';

export class SkillService {
  private repo = new SkillRepository();

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