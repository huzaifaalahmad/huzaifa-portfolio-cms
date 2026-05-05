import { Response } from 'express';
import { AuthRequest } from '@/types/api.types';
import { ExperienceService } from '@/services/experience.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/responseFormatter';

export class ExperienceController {
  private service = new ExperienceService();

  getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.getAll();
    sendSuccess(res, data);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const experience = await this.service.create(req.body);
    sendSuccess(res, experience, 'Experience created', 201);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.service.delete(req.params.id);
    sendSuccess(res, null, 'Experience deleted');
  });
} 