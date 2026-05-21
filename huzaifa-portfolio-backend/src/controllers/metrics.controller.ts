import { Response } from 'express';
import { AuthRequest } from '@/types/api.types';
import { MetricsService } from '@/services/metrics.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/responseFormatter';

export class MetricsController {
  private service = new MetricsService();

  recordVisit = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.recordVisit();
    sendSuccess(res, data, 'Visit recorded');
  });

  recordCvDownload = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.recordCvDownload();
    sendSuccess(res, data, 'CV download recorded');
  });

  summary = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const data = await this.service.getSummary();
    sendSuccess(res, data);
  });
}
