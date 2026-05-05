import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const requestId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = randomUUID();

  res.setHeader('X-Request-Id', id);
  next();
};