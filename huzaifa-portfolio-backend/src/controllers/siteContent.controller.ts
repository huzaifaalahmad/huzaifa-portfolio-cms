import { Response } from 'express';
import { AuthRequest } from '@/types/api.types';
import { SiteContentService } from '@/services/siteContent.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/responseFormatter';

export class SiteContentController {
  private service = new SiteContentService();

  get = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.getContent();
    sendSuccess(res, data);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await this.service.updateContent(req.body);
    sendSuccess(res, data, 'Site content updated');
  });

  uploadCv = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await this.service.uploadCv(req.body);
    sendSuccess(res, data, 'CV uploaded');
  });
}
