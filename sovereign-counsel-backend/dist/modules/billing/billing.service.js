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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
let BillingService = class BillingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, user) {
        const matter = await this.prisma.matter.findFirst({ where: { id: dto.matterId, organizationId: user.organizationId } });
        if (!matter) {
            throw new common_1.ForbiddenException('Matter does not belong to your organization');
        }
        const amount = (dto.durationMinutes / 60) * dto.hourlyRate;
        return this.prisma.billingEntry.create({
            data: {
                organizationId: user.organizationId,
                matterId: dto.matterId,
                userId: user.sub,
                description: dto.description,
                durationMinutes: dto.durationMinutes,
                hourlyRate: dto.hourlyRate,
                amount,
                billableDate: new Date(dto.billableDate),
            },
        });
    }
    findAll(organizationId) {
        return this.prisma.billingEntry.findMany({ where: { organizationId }, orderBy: { billableDate: 'desc' } });
    }
    async summary(organizationId) {
        const [entries, invoices] = await Promise.all([
            this.prisma.billingEntry.findMany({ where: { organizationId }, orderBy: { billableDate: 'desc' }, take: 100 }),
            this.prisma.invoice.findMany({ where: { organizationId }, orderBy: { issueDate: 'desc' }, take: 100 }),
        ]);
        const paid = invoices
            .filter((invoice) => invoice.status === 'PAID')
            .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
        const outstanding = invoices
            .filter((invoice) => invoice.status !== 'PAID' && invoice.status !== 'VOID')
            .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
        return {
            outstanding,
            paid,
            invoices,
            entries,
        };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingService);
