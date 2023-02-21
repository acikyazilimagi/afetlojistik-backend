import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransformResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((response: Response) => ({
        data: response,
        timestamp: Math.floor(new Date().getTime() / 1000),
        path: request.path,
        statusCode: response.statusCode,
      })),
      catchError((err) => {
        this.logger.error(err);
        return throwError(() => err);
      })
    );
  }
}
