import { Experience } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class ExperienceRepository extends BaseRepository<Experience> {
  constructor() {
    super('experience');
  }

  async findAll() {
    return this.model.findMany({
      where: { deletedAt: null, isVisible: true },
      orderBy: { order: 'asc' },
    });
  }
}