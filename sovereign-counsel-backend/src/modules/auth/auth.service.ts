import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AcceptInviteDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async acceptInvite(dto: AcceptInviteDto) {
    const invite = await (this.prisma as any).invite.findUnique({
      where: { token: dto.inviteToken },
    });
    if (!invite || invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite is invalid or expired');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        organizationId: invite.organizationId,
        email: invite.email.toLowerCase(),
      },
      select: { id: true },
    });
    if (existingUser) {
      await (this.prisma as any).invite.delete({ where: { id: invite.id } });
      throw new BadRequestException('Invite already used');
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

    await (this.prisma as any).invite.delete({ where: { id: invite.id } });
    return this.issueTokens(
      user.id,
      user.organizationId,
      user.role.name,
      this.parsePermissions(user.role.permissions),
    );
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase() },
      include: { role: true },
    });
  
    // ✅ prevent crash
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
  
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    return this.issueTokens(
      user.id,
      user.organizationId,
      user.role.name,
      this.parsePermissions(user.role.permissions),
    );
  }

  async refresh(refreshToken: string) {
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
      throw new UnauthorizedException('Refresh token not found');
    }

    const valid = await bcrypt.compare(refreshToken, record.tokenHash);
    if (!valid || record.expiresAt <= new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.issueTokens(user.id, user.organizationId, user.role.name, this.parsePermissions(user.role.permissions));
  }

  async logout(refreshToken: string) {
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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email: email.toLowerCase() } });
    if (!user) {
      return { accepted: true };
    }

    const resetToken = randomUUID();
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

  async resetPassword(token: string, newPassword: string) {
    const users = await this.prisma.user.findMany({ where: { passwordResetTokenHash: { not: null } } });
    const matched = await Promise.all(
      users.map(async (u: any) => ({
        user: u,
        matches: (await bcrypt.compare(token, u.passwordResetTokenHash ?? '')) &&
          !!u.passwordResetTokenExp &&
          u.passwordResetTokenExp > new Date(),
      })),
    );

    const entry = matched.find((item) => item.matches);
    if (!entry) {
      throw new BadRequestException('Invalid or expired reset token');
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

  private async issueTokens(
    userId: string,
    organizationId: string,
    roleName: string,
    permissions: string[],
  ) {
    const payload = {
      sub: userId,
      organizationId,
      roleName,
      permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwt.accessSecret'),
      expiresIn: this.configService.get<string>('app.jwt.accessExpiresIn') as StringValue,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('app.jwt.refreshExpiresIn') as StringValue,
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

  private async verifyRefreshToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<{
        sub: string;
        organizationId: string;
      }>(token, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private parsePermissions(value: unknown): string[] {
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      return value;
    }
    return [];
  }
}
