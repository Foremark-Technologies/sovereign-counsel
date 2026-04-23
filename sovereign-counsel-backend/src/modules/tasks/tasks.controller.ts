import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { ok } from 'src/common/dto/api-response.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Permissions('tasks:create')
  async create(@Body() dto: CreateTaskDto, @Req() req: any) {
    return ok(await this.tasksService.create(dto, req.user));
  }

  @Get()
  @Permissions('tasks:read')
  async list(@Req() req: any) {
    return ok(await this.tasksService.findAll(req.user.organizationId));
  }

  @Get('my')
  @Permissions('tasks:read')
  async myTasks(@Req() req: any) {
    return ok(await this.tasksService.findMy(req.user));
  }
}
