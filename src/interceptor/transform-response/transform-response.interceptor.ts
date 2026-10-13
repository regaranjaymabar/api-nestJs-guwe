import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface StandardResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformResponseInterceptor<T>implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const currentStatusCode = response.statusCode;

    // next.handle() menghasilkan nilai dari return controller
    return next.handle().pipe(
      map((originalData) => ({
        success: true,
        message: 'Request berhasil diproses',
        statusCode: currentStatusCode,
        // Jika controller me-return null/undefined, gantikan dengan null aman
        data: originalData ?? null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
