import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { AuditService } from 'src/modules/audit/audit.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      tap(() => {
        const shouldAudit = ['POST', 'PATCH', 'DELETE'].includes(request.method);
        if (!shouldAudit) {
          return;
        }
        void this.auditService.log({
          organizationId: user?.organizationId,
          userId: user?.sub,
          action: `${request.method} ${request.route?.path ?? request.url}`,
          entity: request.baseUrl ?? 'unknown',
          metadata: {
            params: request.params,
          },
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });
      }),
    );
  }
}
