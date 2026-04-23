"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_1 = __importDefault(require("./config/app.config"));
const prisma_module_1 = require("./prisma/prisma.module");
const core_1 = require("@nestjs/core");
const audit_log_interceptor_1 = require("./common/interceptors/audit-log.interceptor");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const matters_module_1 = require("./modules/matters/matters.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const documents_module_1 = require("./modules/documents/documents.module");
const billing_module_1 = require("./modules/billing/billing.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const audit_module_1 = require("./modules/audit/audit.module");
const roles_module_1 = require("./modules/roles/roles.module");
const organizations_module_1 = require("./modules/organizations/organizations.module");
const hearings_module_1 = require("./modules/hearings/hearings.module");
const invoices_module_1 = require("./modules/invoices/invoices.module");
const reports_module_1 = require("./modules/reports/reports.module");
const core_2 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [app_config_1.default] }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            matters_module_1.MattersModule,
            tasks_module_1.TasksModule,
            documents_module_1.DocumentsModule,
            billing_module_1.BillingModule,
            notifications_module_1.NotificationsModule,
            dashboard_module_1.DashboardModule,
            audit_module_1.AuditModule,
            roles_module_1.RolesModule,
            organizations_module_1.OrganizationsModule,
            hearings_module_1.HearingsModule,
            invoices_module_1.InvoicesModule,
            reports_module_1.ReportsModule,
        ],
        providers: [
            {
                provide: core_2.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_log_interceptor_1.AuditLogInterceptor,
            },
        ],
    })
], AppModule);
