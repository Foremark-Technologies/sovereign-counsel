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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
const storage_service_1 = require("src/common/utils/storage.service");
let DocumentsService = class DocumentsService {
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async uploadAndCreateMetadata(dto, file, user) {
        await this.assertMatterAccess(dto.matterId, user);
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException('File is required');
        }
        const key = `${user.organizationId}/${dto.matterId}/${Date.now()}-${dto.fileName}`;
        await this.storageService.uploadFile({
            key,
            contentType: dto.mimeType,
            file: file.buffer,
        });
        const document = await this.prisma.document.create({
            data: {
                organizationId: user.organizationId,
                matterId: dto.matterId,
                folderId: dto.folderId,
                uploadedById: user.sub,
                title: dto.title,
                fileName: dto.fileName,
                mimeType: dto.mimeType,
                sizeBytes: dto.sizeBytes,
                storageKey: key,
                versions: {
                    create: {
                        version: 1,
                        fileName: dto.fileName,
                        mimeType: dto.mimeType,
                        sizeBytes: dto.sizeBytes,
                        storageKey: key,
                    },
                },
            },
        });
        return {
            ...document,
            fileUrl: await this.storageService.getDownloadSignedUrl(document.storageKey),
        };
    }
    async generateSignedUploadUrl(dto, user) {
        await this.assertMatterAccess(dto.matterId, user);
        const key = `${user.organizationId}/${dto.matterId}/${Date.now()}-${dto.fileName}`;
        const uploadUrl = await this.storageService.getUploadSignedUrl({
            key,
            contentType: dto.mimeType,
            upsert: false,
        });
        return { uploadUrl, storageKey: key };
    }
    async createMetadataFromUploadedFile(dto, storageKey, user) {
        await this.assertMatterAccess(dto.matterId, user);
        const document = await this.prisma.document.create({
            data: {
                organizationId: user.organizationId,
                matterId: dto.matterId,
                folderId: dto.folderId,
                uploadedById: user.sub,
                title: dto.title,
                fileName: dto.fileName,
                mimeType: dto.mimeType,
                sizeBytes: dto.sizeBytes,
                storageKey,
                versions: {
                    create: {
                        version: 1,
                        fileName: dto.fileName,
                        mimeType: dto.mimeType,
                        sizeBytes: dto.sizeBytes,
                        storageKey,
                    },
                },
            },
        });
        return {
            ...document,
            fileUrl: await this.storageService.getDownloadSignedUrl(document.storageKey),
        };
    }
    async findAll(organizationId, matterId) {
        const documents = await this.prisma.document.findMany({
            where: { organizationId, ...(matterId ? { matterId } : {}) },
            orderBy: { createdAt: 'desc' },
        });
        return Promise.all(documents.map(async (document) => ({
            ...document,
            fileUrl: await this.storageService.getDownloadSignedUrl(document.storageKey),
        })));
    }
    async getSignedDownloadUrl(documentId, user) {
        const document = await this.prisma.document.findFirst({
            where: { id: documentId, organizationId: user.organizationId },
            include: { matter: { select: { id: true, createdById: true } } },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        await this.assertMatterAccess(document.matterId, user);
        return {
            documentId: document.id,
            fileUrl: await this.storageService.getDownloadSignedUrl(document.storageKey),
        };
    }
    async delete(documentId, user) {
        const document = await this.prisma.document.findFirst({
            where: { id: documentId, organizationId: user.organizationId },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        await this.assertMatterAccess(document.matterId, user);
        await this.storageService.deleteFile(document.storageKey);
        await this.prisma.document.delete({ where: { id: documentId } });
        return { deleted: true };
    }
    async assertMatterAccess(matterId, user) {
        const matter = await this.prisma.matter.findFirst({
            where: {
                id: matterId,
                organizationId: user.organizationId,
                OR: [{ createdById: user.sub }, { assignees: { some: { userId: user.sub } } }],
            },
            select: { id: true },
        });
        if (!matter) {
            throw new common_1.ForbiddenException('You do not have access to this matter');
        }
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], DocumentsService);
