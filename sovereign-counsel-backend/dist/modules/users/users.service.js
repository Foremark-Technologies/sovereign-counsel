"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.roleBlueprints = [
            { name: 'Admin', permissions: ['users:create', 'users:read', 'matters:create', 'matters:read', 'matters:update', 'matters:assign', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read', 'billing:read'] },
            { name: 'Managing Partner', permissions: ['users:create', 'users:read', 'matters:create', 'matters:read', 'matters:update', 'matters:assign', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read', 'billing:read'] },
            { name: 'Partner', permissions: ['users:read', 'matters:create', 'matters:read', 'matters:update', 'matters:assign', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read', 'billing:read'] },
            { name: 'Associate', permissions: ['matters:create', 'matters:read', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read'] },
            { name: 'Paralegal', permissions: ['matters:read', 'tasks:create', 'tasks:read', 'documents:create', 'documents:read'] },
            { name: 'Finance', permissions: ['billing:read', 'matters:read', 'tasks:read', 'documents:read'] },
            { name: 'Operations', permissions: ['users:read', 'matters:read', 'tasks:read', 'documents:read'] },
        ];
    }
    async findAll(organizationId) {
        return this.prisma.user.findMany({
            where: { organizationId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                status: true,
                role: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(dto, actorOrganizationId) {
        if (dto.organizationId !== actorOrganizationId) {
            throw new common_1.BadRequestException('Cross-organization user creation is not allowed');
        }
        return this.prisma.user.create({
            data: {
                organizationId: dto.organizationId,
                roleId: dto.roleId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email.toLowerCase(),
                passwordHash: await bcrypt.hash(dto.password, 12),
            },
        });
    }
    async invite(dto, actor) {
        const organizationId = dto.organizationId ?? actor.organizationId;
        if (organizationId !== actor.organizationId) {
            throw new common_1.BadRequestException('Cross-organization invite is not allowed');
        }
        await this.ensureRoleHierarchy(organizationId);
        const role = await this.prisma.role.findFirst({
            where: { id: dto.roleId, organizationId },
        });
        if (!role) {
            throw new common_1.BadRequestException('Role not found in organization');
        }
        const existingUser = await this.prisma.user.findFirst({
            where: { organizationId, email: dto.email.toLowerCase() },
            select: { id: true },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists for this organization');
        }
        const token = (0, crypto_1.randomUUID)();
        const invite = await this.prisma.invite.create({
            data: {
                email: dto.email.toLowerCase(),
                roleId: dto.roleId,
                organizationId,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            inviteId: invite.id,
            inviteToken: invite.token,
            expiresAt: invite.expiresAt,
        };
    }
    async me(userId, organizationId) {
        return this.prisma.user.findFirst({
            where: { id: userId, organizationId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                organizationId: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        permissions: true,
                    },
                },
            },
        });
    }
    async roles(organizationId) {
        await this.ensureRoleHierarchy(organizationId);
        return this.prisma.role.findMany({
            where: { organizationId },
            select: {
                id: true,
                name: true,
                permissions: true,
            },
            orderBy: { name: 'asc' },
        });
    }
    async ensureRoleHierarchy(organizationId) {
        await Promise.all(this.roleBlueprints.map((role) => this.prisma.role.upsert({
            where: { organizationId_name: { organizationId, name: role.name } },
            update: {},
            create: {
                organizationId,
                name: role.name,
                permissions: role.permissions,
                isSystemRole: true,
            },
        })));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
