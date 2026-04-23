import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ok } from 'src/common/dto/api-response.dto';
import { InviteUserDto } from './dto/invite-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RbacGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('users:read')
  async list(@Req() req: any) {
    return ok(await this.usersService.findAll(req.user.organizationId));
  }

  @Post()
  @Permissions('users:create')
  async create(@Body() dto: CreateUserDto, @Req() req: any) {
    return ok(await this.usersService.create(dto, req.user.organizationId));
  }

  @Post('invite')
  @Permissions('users:create')
  async invite(@Body() dto: InviteUserDto, @Req() req: any) {
    return ok(await this.usersService.invite(dto, req.user), 'Invite created');
  }

  @Get('me')
  async me(@Req() req: any) {
    return ok(await this.usersService.me(req.user.sub, req.user.organizationId));
  }

  @Get('roles')
  @Permissions('users:read')
  async roles(@Req() req: any) {
    return ok(await this.usersService.roles(req.user.organizationId));
  }
}
