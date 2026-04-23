import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InviteUserDto } from './dto/invite-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly roleBlueprints: Array<{ name: string; permissions: string[] }> = [
    { name: 'Admin', permissions: ['users:create', 'users:read', 'matters:create', 'matters:read', 'matters:update', 'matters:assign', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read', 'billing:read'] },
    { name: 'Managing Partner', permissions: ['users:create', 'users:read', 'matters:create', 'matters:read', 'matters:update', 'matters:assign', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read', 'billing:read'] },
    { name: 'Partner', permissions: ['users:read', 'matters:create', 'matters:read', 'matters:update', 'matters:assign', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read', 'billing:read'] },
    { name: 'Associate', permissions: ['matters:create', 'matters:read', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read'] },
    { name: 'Paralegal', permissions: ['matters:read', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read'] },
    { name: 'Finance', permissions: ['billing:read', 'matters:read', 'tasks:read', 'documents:read'] },
    { name: 'Operations', permissions: ['users:read', 'matters:read', 'tasks:read', 'documents:read'] },
  ];

  
  async findAll(organizationId: string) {
    return this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        role: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateUserDto, actorOrganizationId: string) {
    if (dto.organizationId !== actorOrganizationId) {
      throw new BadRequestException('Cross-organization user creation is not allowed');
    }

    return this.prisma.user.create({
      data: {
        organizationId: dto.organizationId,
        roleId: dto.roleId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email.toLowerCase(),
        passwordHash: await bcrypt.hash(dto.password, 12),
      },
    });
  }

  async invite(dto: InviteUserDto, actor: { organizationId: string }) {
    const organizationId = dto.organizationId ?? actor.organizationId;
    if (organizationId !== actor.organizationId) {
      throw new BadRequestException('Cross-organization invite is not allowed');
    }

    await this.ensureRoleHierarchy(organizationId);

    const role = await this.prisma.role.findFirst({
      where: { id: dto.roleId, organizationId },
    });
    if (!role) {
      throw new BadRequestException('Role not found in organization');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { organizationId, email: dto.email.toLowerCase() },
      select: { id: true },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists for this organization');
    }

    const token = randomUUID();
    const invite = await (this.prisma as any).invite.create({
      data: {
        email: dto.email.toLowerCase(),
        roleId: dto.roleId,
        organizationId,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      inviteId: invite.id,
      inviteToken: invite.token,
      expiresAt: invite.expiresAt,
    };
  }

  async me(userId: string, organizationId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId, organizationId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organizationId: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: true,
          },
        },
      },
    });
  }

  async roles(organizationId: string) {
    await this.ensureRoleHierarchy(organizationId);
    return this.prisma.role.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        permissions: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  private async ensureRoleHierarchy(organizationId: string) {
    await Promise.all(
      this.roleBlueprints.map((role) =>
        this.prisma.role.upsert({
          where: { organizationId_name: { organizationId, name: role.name } },
          update: {},
          create: {
            organizationId,
            name: role.name,
            permissions: role.permissions,
            isSystemRole: true,
          },
        }),
      ),
    );
  }
}
