import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MattersService } from '../matters/matters.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mattersService: MattersService,
  ) {}

  async getStats(organizationId: string) {
    const [activeMatters, upcomingHearings, pendingTasks, billingSummary] = await Promise.all([
      this.prisma.matter.count({ where: { organizationId, status: { in: ['OPEN', 'ON_HOLD'] } } }),
      this.prisma.hearing.count({ where: { organizationId, hearingDate: { gte: new Date() } } }),
      this.prisma.task.count({ where: { organizationId, status: { in: ['TODO', 'IN_PROGRESS', 'BLOCKED'] } } }),
      this.prisma.billingEntry.aggregate({
        where: { organizationId },
        _sum: { amount: true, durationMinutes: true },
      }),
    ]);

    return {
      activeMatters,
      upcomingHearings,
      pendingTasks,
      billingSummary,
    };
  }

  async getSummary(user: { sub: string; organizationId: string; roleName?: string; teamId?: string }) {
    const myMatters = await this.mattersService.getAccessibleMatters(user);
    const now = new Date();

    const upcomingHearings = myMatters
      .filter((matter) => !!matter.nextHearingDate && matter.nextHearingDate >= now)
      .sort((a, b) => (a.nextHearingDate!.getTime() - b.nextHearingDate!.getTime()))
      .slice(0, 10);

    const deadlines = myMatters
      .filter((matter) => !!matter.nextDeadline)
      .sort((a, b) => (a.nextDeadline!.getTime() - b.nextDeadline!.getTime()))
      .slice(0, 10);

    return {
      myMatters: myMatters.slice(0, 25),
      myTasks: [],
      upcomingHearings,
      deadlines,
    };
  }
}
