"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MattersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
let MattersService = class MattersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(organizationId) {
        return this.prisma.matter.findMany({
            where: { organizationId },
            include: { client: true },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async create(dto, user) {
        if (dto.clientId) {
            const client = await this.prisma.client.findFirst({
                where: { id: dto.clientId, organizationId: user.organizationId },
            });
            if (!client) {
                throw new common_1.ForbiddenException('Client does not belong to your organization');
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
    async createHearing(dto, user) {
        const matter = await this.prisma.matter.findFirst({
            where: { id: dto.matterId, organizationId: user.organizationId },
            select: { id: true, matterTitle: true, title: true },
        });
        if (!matter) {
            throw new common_1.NotFoundException('Matter not found');
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
    async findById(id, organizationId) {
        const matter = await this.prisma.matter.findFirst({
            where: { id, organizationId },
            include: {
                activities: true,
                tasks: true,
                hearings: true,
            },
        });
        if (!matter) {
            throw new common_1.NotFoundException('Matter not found');
        }
        return matter;
    }
    async update(id, dto, organizationId) {
        const matter = await this.prisma.matter.findFirst({ where: { id, organizationId } });
        if (!matter) {
            throw new common_1.NotFoundException('Matter not found');
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
    async assignUser(dto, actor) {
        const matter = await this.prisma.matter.findFirst({
            where: { id: dto.matterId, organizationId: actor.organizationId },
            select: { id: true },
        });
        if (!matter) {
            throw new common_1.NotFoundException('Matter not found');
        }
        const user = await this.prisma.user.findFirst({
            where: { id: dto.userId, organizationId: actor.organizationId },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    async getAccessibleMatters(user) {
        const isPrivileged = ['Admin', 'Managing Partner'].includes(user.roleName ?? '');
        const where = isPrivileged
            ? { organizationId: user.organizationId }
            : {
                organizationId: user.organizationId,
                OR: [
                    { createdById: user.sub },
                    { assignments: { some: { userId: user.sub } } },
                    { sharedWith: { some: { userId: user.sub } } },
                    { visibilityLevel: 'ORG' },
                    ...(user.teamId ? [{ visibilityLevel: 'TEAM', teamId: user.teamId }] : []),
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
};
exports.MattersService = MattersService;
exports.MattersService = MattersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MattersService);
