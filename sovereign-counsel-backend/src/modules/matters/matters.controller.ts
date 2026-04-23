import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MattersService } from './matters.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { AssignMatterUserDto, CreateHearingDto, CreateMatterDto, UpdateMatterDto } from './dto/matter.dto';
import { ok } from 'src/common/dto/api-response.dto';

@Controller('matters')
@UseGuards(JwtAuthGuard, RbacGuard)
export class MattersController {
  constructor(private readonly mattersService: MattersService) {}

  @Get()
  @Permissions('matters:read')
  async list(@Req() req: any) {
    return ok(await this.mattersService.findAll(req.user.organizationId));
  }

  @Get('my')
  @Permissions('matters:read')
  async myMatters(@Req() req: any) {
    return ok(await this.mattersService.getAccessibleMatters(req.user));
  }

  @Post()
  @Permissions('matters:create')
  async create(@Body() dto: CreateMatterDto, @Req() req: any) {
    return ok(await this.mattersService.create(dto, req.user));
  }

  @Get(':id')
  @Permissions('matters:read')
  async getById(@Param('id') id: string, @Req() req: any) {
    return ok(await this.mattersService.findById(id, req.user.organizationId));
  }

  @Patch(':id')
  @Permissions('matters:update')
  async update(@Param('id') id: string, @Body() dto: UpdateMatterDto, @Req() req: any) {
    return ok(await this.mattersService.update(id, dto, req.user.organizationId));
  }

  @Post('assign-user')
  @Permissions('matters:assign')
  async assignUser(@Body() dto: AssignMatterUserDto, @Req() req: any) {
    return ok(await this.mattersService.assignUser(dto, req.user), 'User assigned');
  }

  @Post('hearing')
  @Permissions('matters:create')
  async createHearing(@Body() dto: CreateHearingDto, @Req() req: any) {
    return ok(await this.mattersService.createHearing(dto, req.user), 'Hearing created');
  }
}
