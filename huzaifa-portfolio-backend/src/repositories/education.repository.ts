import { Education, Certification } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class EducationRepository extends BaseRepository<Education> {
  constructor() {
    super('education');
  }

  async findAll() {
    return this.model.findMany({
      where: { deletedAt: null, isVisible: true },
      orderBy: { order: 'asc' },
    });
  }
}

export class CertificationRepository extends BaseRepository<Certification> {
  constructor() {
    super('certification');
  }

  async findAll() {
    return this.model.findMany({
      where: { deletedAt: null, isVisible: true },
      orderBy: { order: 'asc' },
    });
  }
}