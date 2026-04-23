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
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const documents_service_1 = require("./documents.service");
const jwt_auth_guard_1 = require("src/common/guards/jwt-auth.guard");
const rbac_guard_1 = require("src/common/guards/rbac.guard");
const permissions_decorator_1 = require("src/common/decorators/permissions.decorator");
const upload_document_dto_1 = require("./dto/upload-document.dto");
const api_response_dto_1 = require("src/common/dto/api-response.dto");
const platform_express_1 = require("@nestjs/platform-express");
const create_document_metadata_dto_1 = require("./dto/create-document-metadata.dto");
let DocumentsController = class DocumentsController {
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    async generateUploadUrl(dto, req) {
        return (0, api_response_dto_1.ok)(await this.documentsService.generateSignedUploadUrl(dto, req.user));
    }
    async upload(dto, file, req) {
        return (0, api_response_dto_1.ok)(await this.documentsService.uploadAndCreateMetadata(dto, file, req.user));
    }
    async createMetadata(dto, req) {
        return (0, api_response_dto_1.ok)(await this.documentsService.createMetadataFromUploadedFile(dto, dto.storageKey, req.user));
    }
    async list(req, matterId) {
        return (0, api_response_dto_1.ok)(await this.documentsService.findAll(req.user.organizationId, matterId));
    }
    async getDownloadUrl(id, req) {
        return (0, api_response_dto_1.ok)(await this.documentsService.getSignedDownloadUrl(id, req.user));
    }
    async remove(id, req) {
        return (0, api_response_dto_1.ok)(await this.documentsService.delete(id, req.user));
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)('upload-url'),
    (0, permissions_decorator_1.Permissions)('documents:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_document_dto_1.UploadDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "generateUploadUrl", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, permissions_decorator_1.Permissions)('documents:create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_document_dto_1.UploadDocumentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)('metadata'),
    (0, permissions_decorator_1.Permissions)('documents:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_document_metadata_dto_1.CreateDocumentMetadataDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "createMetadata", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('documents:read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('matterId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id/download-url'),
    (0, permissions_decorator_1.Permissions)('documents:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getDownloadUrl", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.Permissions)('documents:delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "remove", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.Controller)('documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
