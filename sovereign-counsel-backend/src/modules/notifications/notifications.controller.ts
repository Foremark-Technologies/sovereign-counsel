import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { ok } from 'src/common/dto/api-response.dto';

@Controller(['notifications', 'alerts'])
@UseGuards(JwtAuthGuard, RbacGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(@Req() req: any) {
    return ok(await this.notificationsService.findForUser(req.user.organizationId, req.user.sub));
  }
}
