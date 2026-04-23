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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("src/common/guards/jwt-auth.guard");
const rbac_guard_1 = require("src/common/guards/rbac.guard");
const permissions_decorator_1 = require("src/common/decorators/permissions.decorator");
const create_user_dto_1 = require("./dto/create-user.dto");
const api_response_dto_1 = require("src/common/dto/api-response.dto");
const invite_user_dto_1 = require("./dto/invite-user.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async list(req) {
        return (0, api_response_dto_1.ok)(await this.usersService.findAll(req.user.organizationId));
    }
    async create(dto, req) {
        return (0, api_response_dto_1.ok)(await this.usersService.create(dto, req.user.organizationId));
    }
    async invite(dto, req) {
        return (0, api_response_dto_1.ok)(await this.usersService.invite(dto, req.user), 'Invite created');
    }
    async me(req) {
        return (0, api_response_dto_1.ok)(await this.usersService.me(req.user.sub, req.user.organizationId));
    }
    async roles(req) {
        return (0, api_response_dto_1.ok)(await this.usersService.roles(req.user.organizationId));
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('users:read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('users:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('invite'),
    (0, permissions_decorator_1.Permissions)('users:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invite_user_dto_1.InviteUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "invite", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, permissions_decorator_1.Permissions)('users:read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "roles", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
