import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBillingDto } from './dto/create-billing.dto';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBillingDto, user: any) {
    const matter = await this.prisma.matter.findFirst({ where: { id: dto.matterId, organizationId: user.organizationId } });
    if (!matter) {
      throw new ForbiddenException('Matter does not belong to your organization');
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

  findAll(organizationId: string) {
    return this.prisma.billingEntry.findMany({ where: { organizationId }, orderBy: { billableDate: 'desc' } });
  }

  async summary(organizationId: string) {
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
}
