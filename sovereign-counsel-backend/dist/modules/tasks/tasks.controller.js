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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("./tasks.service");
const jwt_auth_guard_1 = require("src/common/guards/jwt-auth.guard");
const rbac_guard_1 = require("src/common/guards/rbac.guard");
const permissions_decorator_1 = require("src/common/decorators/permissions.decorator");
const create_task_dto_1 = require("./dto/create-task.dto");
const api_response_dto_1 = require("src/common/dto/api-response.dto");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(dto, req) {
        return (0, api_response_dto_1.ok)(await this.tasksService.create(dto, req.user));
    }
    async list(req) {
        return (0, api_response_dto_1.ok)(await this.tasksService.findAll(req.user.organizationId));
    }
    async myTasks(req) {
        return (0, api_response_dto_1.ok)(await this.tasksService.findMy(req.user));
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('tasks:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('tasks:read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, permissions_decorator_1.Permissions)('tasks:read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "myTasks", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
