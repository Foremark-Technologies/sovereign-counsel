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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
const matters_service_1 = require("../matters/matters.service");
let DashboardService = class DashboardService {
    constructor(prisma, mattersService) {
        this.prisma = prisma;
        this.mattersService = mattersService;
    }
    async getStats(organizationId) {
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
    async getSummary(user) {
        const myMatters = await this.mattersService.getAccessibleMatters(user);
        const now = new Date();
        const upcomingHearings = myMatters
            .filter((matter) => !!matter.nextHearingDate && matter.nextHearingDate >= now)
            .sort((a, b) => (a.nextHearingDate.getTime() - b.nextHearingDate.getTime()))
            .slice(0, 10);
        const deadlines = myMatters
            .filter((matter) => !!matter.nextDeadline)
            .sort((a, b) => (a.nextDeadline.getTime() - b.nextDeadline.getTime()))
            .slice(0, 10);
        return {
            myMatters: myMatters.slice(0, 25),
            myTasks: [],
            upcomingHearings,
            deadlines,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        matters_service_1.MattersService])
], DashboardService);
