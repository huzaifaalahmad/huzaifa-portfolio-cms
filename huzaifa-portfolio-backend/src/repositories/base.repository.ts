import { PrismaClient } from '@prisma/client';
import { prisma } from '@/config/database';
import { NotFoundError } from '@/utils/errorClasses';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

 public get model(): any {
    return (this.prisma as any)[this.modelName];
  }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findFirst({
      where: { id, deletedAt: null },
      include,
    });
  }

  async findByIdOrFail(id: string, include?: any): Promise<T> {
    const record = await this.findById(id, include);

    if (!record) {
      throw new NotFoundError(`${this.modelName} not found`);
    }

    return record;
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    await this.findByIdOrFail(id);

    return this.model.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<T> {
    await this.findByIdOrFail(id);

    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}