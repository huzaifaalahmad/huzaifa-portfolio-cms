import { Project } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('project');
  }

  async findAll() {
    return this.model.findMany({
      where: { deletedAt: null, isVisible: true },
      orderBy: { order: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.model.findFirst({
      where: {
        slug,
        deletedAt: null,
        isVisible: true,
      },
    });
  }
}