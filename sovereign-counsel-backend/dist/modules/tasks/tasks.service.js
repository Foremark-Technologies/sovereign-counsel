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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, user) {
        const matter = await this.prisma.matter.findFirst({ where: { id: dto.matterId, organizationId: user.organizationId } });
        if (!matter) {
            throw new common_1.ForbiddenException('Matter does not belong to your organization');
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
    findAll(organizationId) {
        return this.prisma.task.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
    }
    findMy(user) {
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
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
