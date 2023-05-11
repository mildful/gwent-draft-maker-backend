import { NextFunction, Request, Response } from 'express';
import { Validator } from '../../domain/shared/Validator';

export class CorsMiddleware {
  private readonly origins: string[];

  constructor(origins: string[]) {
    this.origins = Validator.isArray(origins) ? origins : [];
  }

  public addCorsHeaders(req: Request, res: Response, next: NextFunction): void {
    const origin = req.get('Origin') as string;
    if (this.origins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Range, x-kraken-auth, x-butler-auth, g-recaptcha-response, Authorization',
      );
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    }

    next();
  }
}
