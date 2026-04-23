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
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const audit_service_1 = require("src/modules/audit/audit.service");
let AuditLogInterceptor = class AuditLogInterceptor {
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return next.handle().pipe((0, rxjs_1.tap)(() => {
            const shouldAudit = ['POST', 'PATCH', 'DELETE'].includes(request.method);
            if (!shouldAudit) {
                return;
            }
            void this.auditService.log({
                organizationId: user?.organizationId,
                userId: user?.sub,
                action: `${request.method} ${request.route?.path ?? request.url}`,
                entity: request.baseUrl ?? 'unknown',
                metadata: {
                    params: request.params,
                },
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
            });
        }));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditLogInterceptor);
