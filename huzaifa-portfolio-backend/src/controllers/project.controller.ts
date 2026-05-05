import { Response } from 'express';
import { AuthRequest } from '@/types/api.types';
import { ProjectService } from '@/services/project.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/responseFormatter';

export class ProjectController {
  private service = new ProjectService();

  getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.getAll();
    sendSuccess(res, data);
  });

  getBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await this.service.getBySlug(req.params.slug);
    sendSuccess(res, data);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const project = await this.service.create(req.body);
    sendSuccess(res, project, 'Project created', 201);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.service.delete(req.params.id);
    sendSuccess(res, null, 'Project deleted');
  });
}