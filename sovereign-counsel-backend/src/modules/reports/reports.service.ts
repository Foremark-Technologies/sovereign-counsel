import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(organizationId: string) {
    const [matterCount, totalTasks, completedTasks, users] = await Promise.all([
      this.prisma.matter.count({ where: { organizationId } }),
      this.prisma.task.count({ where: { organizationId } }),
      this.prisma.task.count({ where: { organizationId, status: 'COMPLETED' } }),
      this.prisma.user.findMany({ where: { organizationId }, select: { id: true, firstName: true, lastName: true } }),
    ]);

    const taskCompletion = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const openTasks = totalTasks - completedTasks;
    const workload = users.map((user) => ({ userId: user.id, name: `${user.firstName} ${user.lastName}`, openTasks }));

    return {
      matterCount,
      taskCompletion,
      workload,
    };
  }
}
