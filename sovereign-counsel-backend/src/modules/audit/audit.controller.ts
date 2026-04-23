import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { ok } from 'src/common/dto/api-response.dto';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async list(@Req() req: any, @Query('limit') limit?: string) {
    return ok(await this.auditService.findAll(req.user.organizationId, Number(limit ?? 50)));
  }
}
