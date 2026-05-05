import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess, sendError } from '@/utils/responseFormatter';
import { ErrorCode } from '@/types/errorCodes';

export class HealthController {
  check = asyncHandler(async (_req: Request, res: Response) => {
    const dbStatus = await this.checkDatabase();

    const health = {
      status: dbStatus ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    if (dbStatus) {
      return sendSuccess(res, health, 'Service is healthy', 200);
    }

    return sendError(res, ErrorCode.INTERNAL_SERVER_ERROR, 'Service is unhealthy', 503);
  });

  readiness = asyncHandler(async (_req: Request, res: Response) => {
    const dbConnected = await this.checkDatabase();

    if (dbConnected) {
      return sendSuccess(res, { ready: true }, 'Service is ready', 200);
    }

    return sendError(res, ErrorCode.INTERNAL_SERVER_ERROR, 'Service is not ready', 503);
  });

  liveness = asyncHandler(async (_req: Request, res: Response) => {
    return sendSuccess(res, { alive: true }, 'Service is alive', 200);
  });

  private async checkDatabase(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}