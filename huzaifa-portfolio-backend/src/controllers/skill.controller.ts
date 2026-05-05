import { Response } from 'express';
import { AuthRequest } from '@/types/api.types';
import { SkillService } from '@/services/skill.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/responseFormatter';

export class SkillController {
  private service = new SkillService();

  getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.getAll();
    sendSuccess(res, data);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const skill = await this.service.create(req.body);
    sendSuccess(res, skill, 'Skill created', 201);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.service.delete(req.params.id);
    sendSuccess(res, null, 'Skill deleted');
  });
}