import { Response } from 'express';
import { AuthRequest } from '@/types/api.types';
import { EducationService } from '@/services/education.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/responseFormatter';

export class EducationController {
  private service = new EducationService();

  getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.getAll();
    sendSuccess(res, data);
  });

  createEducation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await this.service.createEducation(req.body);
    sendSuccess(res, data, 'Education created', 201);
  });

  createCertification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await this.service.createCertification(req.body);
    sendSuccess(res, data, 'Certification created', 201);
  });

  deleteEducation = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.service.deleteEducation(req.params.id);
    sendSuccess(res, null, 'Education deleted');
  });

  deleteCertification = asyncHandler(async (req: AuthRequest, res: Response) => {
    await this.service.deleteCertification(req.params.id);
    sendSuccess(res, null, 'Certification deleted');
  });
}