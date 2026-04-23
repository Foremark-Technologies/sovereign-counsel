import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface AuditPayload {
  organizationId?: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(payload: AuditPayload) {
    if (!payload.organizationId) return;
    await this.prisma.auditLog.create({
      data: {
        organizationId: payload.organizationId,
        userId: payload.userId,
        action: payload.action,
        entity: payload.entity,
        entityId: payload.entityId,
        metadata: payload.metadata as any,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      },
    });
  }

  findAll(organizationId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 200),
    });
  }
}
