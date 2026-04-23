import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignMatterUserDto, CreateHearingDto, CreateMatterDto, UpdateMatterDto } from './dto/matter.dto';

@Injectable()
export class MattersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(organizationId: string) {
    return this.prisma.matter.findMany({
      where: { organizationId },
      include: { client: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(dto: CreateMatterDto, user: any) {
    if (dto.clientId) {
      const client = await this.prisma.client.findFirst({
        where: { id: dto.clientId, organizationId: user.organizationId },
      });
      if (!client) {
        throw new ForbiddenException('Client does not belong to your organization');
      }
    }

    const matter = await this.prisma.matter.create({
      data: {
        organizationId: user.organizationId,
        clientId: dto.clientId,
        createdById: user.sub,
        title: dto.matterTitle ?? dto.title ?? 'Untitled Matter',
        matterTitle: dto.matterTitle ?? dto.title ?? 'Untitled Matter',
        clientName: dto.clientName,
        description: dto.description,
        practiceArea: dto.practiceArea ?? 'General',
        court: dto.court,
        nextHearingDate: dto.nextHearingDate ? new Date(dto.nextHearingDate) : null,
        nextDeadline: dto.nextDeadline ? new Date(dto.nextDeadline) : null,
        visibilityLevel: dto.visibilityLevel ?? 'PRIVATE',
        priority: 'MEDIUM',
        status: 'OPEN',
      },
    });

    await this.prisma.matterAssignment.upsert({
      where: { matterId_userId: { matterId: matter.id, userId: user.sub } },
      update: {},
      create: { matterId: matter.id, userId: user.sub, role: 'OWNER' },
    });

    return matter;
  }

  async createHearing(dto: CreateHearingDto, user: any) {
    const matter = await this.prisma.matter.findFirst({
      where: { id: dto.matterId, organizationId: user.organizationId },
      select: { id: true, matterTitle: true, title: true },
    });
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    return this.prisma.hearing.create({
      data: {
        matterId: dto.matterId,
        hearingDate: new Date(dto.date),
        forum: dto.court ?? null,
        title: `Hearing - ${matter.matterTitle ?? matter.title}`,
        organizationId: user.organizationId,
        status: 'SCHEDULED',
      },
    });
  }

  async findById(id: string, organizationId: string) {
    const matter = await this.prisma.matter.findFirst({
      where: { id, organizationId },
      include: {
        activities: true,
        tasks: true,
        hearings: true,
      },
    });

    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    return matter;
  }

  async update(id: string, dto: UpdateMatterDto, organizationId: string) {
    const matter = await this.prisma.matter.findFirst({ where: { id, organizationId } });
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    return this.prisma.matter.update({
      where: { id },
      data: {
        ...dto,
        nextDeadline: dto.nextDeadline ? new Date(dto.nextDeadline) : undefined,
        nextHearingDate: dto.nextHearingDate ? new Date(dto.nextHearingDate) : undefined,
      },
    });
  }

  async assignUser(dto: AssignMatterUserDto, actor: any) {
    const matter = await this.prisma.matter.findFirst({
      where: { id: dto.matterId, organizationId: actor.organizationId },
      select: { id: true },
    });
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, organizationId: actor.organizationId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.matterAssignment.upsert({
      where: {
        matterId_userId: {
          matterId: dto.matterId,
          userId: dto.userId,
        },
      },
      update: { role: dto.role },
      create: {
        matterId: dto.matterId,
        userId: dto.userId,
        role: dto.role,
      },
    });
  }

  async getAccessibleMatters(user: {
    sub: string;
    organizationId: string;
    roleName?: string;
    teamId?: string;
  }) {
    const isPrivileged = ['Admin', 'Managing Partner'].includes(user.roleName ?? '');
    const where: Prisma.MatterWhereInput = isPrivileged
      ? { organizationId: user.organizationId }
      : {
          organizationId: user.organizationId,
          OR: [
            { createdById: user.sub },
            { assignments: { some: { userId: user.sub } } },
            { sharedWith: { some: { userId: user.sub } } },
            { visibilityLevel: 'ORG' as const },
            ...(user.teamId ? [{ visibilityLevel: 'TEAM' as const, teamId: user.teamId }] : []),
          ],
        };

    return this.prisma.matter.findMany({
      where,
      select: {
        id: true,
        title: true,
        matterTitle: true,
        clientName: true,
        nextDeadline: true,
        nextHearingDate: true,
        status: true,
        priority: true,
      },
      orderBy: [{ nextDeadline: 'asc' }, { updatedAt: 'desc' }],
    });
  }
}
