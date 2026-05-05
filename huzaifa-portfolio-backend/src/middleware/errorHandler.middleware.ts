import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/errorClasses';
import { ErrorCode } from '@/types/errorCodes';
import { sendError } from '@/utils/responseFormatter';
import { logger } from '@/utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError && err.isOperational) {
    return sendError(
      res,
      ErrorCode.VALIDATION_ERROR,
      err.message,
      err.statusCode,
      (err as AppError & { details?: unknown }).details
    );
  }

  return sendError(
    res,
    ErrorCode.INTERNAL_SERVER_ERROR,
    'Internal server error',
    500
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(
    res,
    ErrorCode.NOT_FOUND,
    'Route ' + req.originalUrl + ' not found',
    404
  );
};