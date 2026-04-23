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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("src/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    constructor(prisma, configService, jwtService) {
        this.prisma = prisma;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async acceptInvite(dto) {
        const invite = await this.prisma.invite.findUnique({
            where: { token: dto.inviteToken },
        });
        if (!invite || invite.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invite is invalid or expired');
        }
        const existingUser = await this.prisma.user.findFirst({
            where: {
                organizationId: invite.organizationId,
                email: invite.email.toLowerCase(),
            },
            select: { id: true },
        });
        if (existingUser) {
            await this.prisma.invite.delete({ where: { id: invite.id } });
            throw new common_1.BadRequestException('Invite already used');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                organizationId: invite.organizationId,
                roleId: invite.roleId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: invite.email.toLowerCase(),
                passwordHash,
                status: 'ACTIVE',
            },
            include: { role: true },
        });
        await this.prisma.invite.delete({ where: { id: invite.id } });
        return this.issueTokens(user.id, user.organizationId, user.role.name, this.parsePermissions(user.role.permissions));
    }
    async login(dto) {
        const user = await this.prisma.user.findFirst({
            where: { email: dto.email.toLowerCase() },
            include: { role: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.issueTokens(user.id, user.organizationId, user.role.name, this.parsePermissions(user.role.permissions));
    }
    async refresh(refreshToken) {
        const payload = await this.verifyRefreshToken(refreshToken);
        const record = await this.prisma.refreshToken.findFirst({
            where: {
                userId: payload.sub,
                organizationId: payload.organizationId,
                revokedAt: null,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!record) {
            throw new common_1.UnauthorizedException('Refresh token not found');
        }
        const valid = await bcrypt.compare(refreshToken, record.tokenHash);
        if (!valid || record.expiresAt <= new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { role: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.issueTokens(user.id, user.organizationId, user.role.name, this.parsePermissions(user.role.permissions));
    }
    async logout(refreshToken) {
        const activeTokens = await this.prisma.refreshToken.findMany({ where: { revokedAt: null } });
        for (const token of activeTokens) {
            const matches = await bcrypt.compare(refreshToken, token.tokenHash);
            if (matches) {
                await this.prisma.refreshToken.update({
                    where: { id: token.id },
                    data: { revokedAt: new Date() },
                });
                break;
            }
        }
        return { loggedOut: true };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findFirst({ where: { email: email.toLowerCase() } });
        if (!user) {
            return { accepted: true };
        }
        const resetToken = (0, crypto_1.randomUUID)();
        const tokenHash = await bcrypt.hash(resetToken, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetTokenHash: tokenHash,
                passwordResetTokenExp: new Date(Date.now() + 30 * 60 * 1000),
            },
        });
        return { accepted: true, resetToken };
    }
    async resetPassword(token, newPassword) {
        const users = await this.prisma.user.findMany({ where: { passwordResetTokenHash: { not: null } } });
        const matched = await Promise.all(users.map(async (u) => ({
            user: u,
            matches: (await bcrypt.compare(token, u.passwordResetTokenHash ?? '')) &&
                !!u.passwordResetTokenExp &&
                u.passwordResetTokenExp > new Date(),
        })));
        const entry = matched.find((item) => item.matches);
        if (!entry) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        await this.prisma.user.update({
            where: { id: entry.user.id },
            data: {
                passwordHash: await bcrypt.hash(newPassword, 12),
                passwordResetTokenHash: null,
                passwordResetTokenExp: null,
            },
        });
        return { reset: true };
    }
    async issueTokens(userId, organizationId, roleName, permissions) {
        const payload = {
            sub: userId,
            organizationId,
            roleName,
            permissions,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('app.jwt.accessSecret'),
            expiresIn: this.configService.get('app.jwt.accessExpiresIn'),
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('app.jwt.refreshSecret'),
            expiresIn: this.configService.get('app.jwt.refreshExpiresIn'),
        });
        await this.prisma.refreshToken.create({
            data: {
                organizationId,
                userId,
                tokenHash: await bcrypt.hash(refreshToken, 10),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            twoFactorRequired: false,
        };
    }
    async verifyRefreshToken(token) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('app.jwt.refreshSecret'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    parsePermissions(value) {
        if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
            return value;
        }
        return [];
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
