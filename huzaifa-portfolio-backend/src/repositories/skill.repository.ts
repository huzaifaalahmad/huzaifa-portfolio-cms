import { Skill } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class SkillRepository extends BaseRepository<Skill> {
  constructor() {
    super('skill');
  }

  async findAll() {
    return this.model.findMany({
      where: { deletedAt: null, isVisible: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  }
}