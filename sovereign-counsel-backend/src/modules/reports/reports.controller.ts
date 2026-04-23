import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { ok } from 'src/common/dto/api-response.dto';
import { ReportsService } from './reports.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getAnalytics(@Req() req: any) {
    return ok(await this.reportsService.getAnalytics(req.user.organizationId));
  }
}
