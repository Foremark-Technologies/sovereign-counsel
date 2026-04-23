import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateBillingDto } from './dto/create-billing.dto';
import { ok } from 'src/common/dto/api-response.dto';

@Controller('billing')
@UseGuards(JwtAuthGuard, RbacGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @Permissions('billing:create')
  async create(@Body() dto: CreateBillingDto, @Req() req: any) {
    return ok(await this.billingService.create(dto, req.user));
  }

  @Get()
  @Permissions('billing:read')
  async list(@Req() req: any) {
    return ok(await this.billingService.findAll(req.user.organizationId));
  }

  @Get('summary')
  @Permissions('billing:read')
  async summary(@Req() req: any) {
    return ok(await this.billingService.summary(req.user.organizationId));
  }
}
