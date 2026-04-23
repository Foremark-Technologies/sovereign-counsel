import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { ok } from 'src/common/dto/api-response.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RbacGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async stats(@Req() req: any) {
    return ok(await this.dashboardService.getStats(req.user.organizationId));
  }

  @Get('summary')
  async summary(@Req() req: any) {
    return ok(await this.dashboardService.getSummary(req.user));
  }
}
