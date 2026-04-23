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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAnalytics(organizationId) {
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
