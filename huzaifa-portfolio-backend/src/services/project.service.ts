import { ProjectRepository } from '@/repositories/project.repository';
import { NotFoundError } from '@/utils/errorClasses';

export class ProjectService {
  private repo = new ProjectRepository();

  async getAll() {
    return this.repo.findAll();
  }

  async getBySlug(slug: string) {
    const project = await this.repo.findBySlug(slug);

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async create(data: any) {
    return this.repo.create(data);
  }

  async delete(id: string) {
    return this.repo.softDelete(id);
  }
}