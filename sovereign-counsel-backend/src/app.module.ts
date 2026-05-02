import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import appConfig from './config/app.config';
import { PrismaModule } from './prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MattersModule } from './modules/matters/matters.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { BillingModule } from './modules/billing/billing.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuditModule } from './modules/audit/audit.module';
import { RolesModule } from './modules/roles/roles.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { HearingsModule } from './modules/hearings/hearings.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ReportsModule } from './modules/reports/reports.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'; // adjust path if needed



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    PassportModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    MattersModule,
    TasksModule,
    DocumentsModule,
    BillingModule,
    NotificationsModule,
    DashboardModule,
    AuditModule,
    RolesModule,
    OrganizationsModule,
    HearingsModule,
    InvoicesModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
