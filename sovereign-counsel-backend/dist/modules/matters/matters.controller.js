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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MattersController = void 0;
const common_1 = require("@nestjs/common");
const matters_service_1 = require("./matters.service");
const jwt_auth_guard_1 = require("src/common/guards/jwt-auth.guard");
const rbac_guard_1 = require("src/common/guards/rbac.guard");
const permissions_decorator_1 = require("src/common/decorators/permissions.decorator");
const matter_dto_1 = require("./dto/matter.dto");
const api_response_dto_1 = require("src/common/dto/api-response.dto");
let MattersController = class MattersController {
    constructor(mattersService) {
        this.mattersService = mattersService;
    }
    async list(req) {
        return (0, api_response_dto_1.ok)(await this.mattersService.findAll(req.user.organizationId));
    }
    async myMatters(req) {
        return (0, api_response_dto_1.ok)(await this.mattersService.getAccessibleMatters(req.user));
    }
    async create(dto, req) {
        return (0, api_response_dto_1.ok)(await this.mattersService.create(dto, req.user));
    }
    async getById(id, req) {
        return (0, api_response_dto_1.ok)(await this.mattersService.findById(id, req.user.organizationId));
    }
    async update(id, dto, req) {
        return (0, api_response_dto_1.ok)(await this.mattersService.update(id, dto, req.user.organizationId));
    }
    async assignUser(dto, req) {
        return (0, api_response_dto_1.ok)(await this.mattersService.assignUser(dto, req.user), 'User assigned');
    }
    async createHearing(dto, req) {
        return (0, api_response_dto_1.ok)(await this.mattersService.createHearing(dto, req.user), 'Hearing created');
    }
};
exports.MattersController = MattersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('matters:read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MattersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, permissions_decorator_1.Permissions)('matters:read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MattersController.prototype, "myMatters", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('matters:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [matter_dto_1.CreateMatterDto, Object]),
    __metadata("design:returntype", Promise)
], MattersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('matters:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MattersController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.Permissions)('matters:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, matter_dto_1.UpdateMatterDto, Object]),
    __metadata("design:returntype", Promise)
], MattersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('assign-user'),
    (0, permissions_decorator_1.Permissions)('matters:assign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [matter_dto_1.AssignMatterUserDto, Object]),
    __metadata("design:returntype", Promise)
], MattersController.prototype, "assignUser", null);
__decorate([
    (0, common_1.Post)('hearing'),
    (0, permissions_decorator_1.Permissions)('matters:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [matter_dto_1.CreateHearingDto, Object]),
    __metadata("design:returntype", Promise)
], MattersController.prototype, "createHearing", null);
exports.MattersController = MattersController = __decorate([
    (0, common_1.Controller)('matters'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [matters_service_1.MattersService])
], MattersController);
