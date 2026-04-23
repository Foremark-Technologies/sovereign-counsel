import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto, user: any) {
    const matter = await this.prisma.matter.findFirst({ where: { id: dto.matterId, organizationId: user.organizationId } });
    if (!matter) {
      throw new ForbiddenException('Matter does not belong to your organization');
    }

    const task = await this.prisma.task.create({
      data: {
        organizationId: user.organizationId,
        matterId: dto.matterId,
        createdById: user.sub,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });

    if (dto.assignedUser) {
      const assignee = await this.prisma.user.findFirst({
        where: { id: dto.assignedUser, organizationId: user.organizationId },
        select: { id: true },
      });
      if (assignee) {
        await this.prisma.taskAssignee.upsert({
          where: { taskId_userId: { taskId: task.id, userId: assignee.id } },
          update: {},
          create: { taskId: task.id, userId: assignee.id },
        });
      }
    }

    return task;
  }

  findAll(organizationId: string) {
    return this.prisma.task.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
  }

  findMy(user: { sub: string; organizationId: string }) {
    return this.prisma.task.findMany({
      where: {
        organizationId: user.organizationId,
        OR: [{ createdById: user.sub }, { assignees: { some: { userId: user.sub } } }],
      },
      include: {
        matter: { select: { id: true, matterTitle: true, title: true, clientName: true } },
        assignees: { select: { userId: true } },
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
  }
}
