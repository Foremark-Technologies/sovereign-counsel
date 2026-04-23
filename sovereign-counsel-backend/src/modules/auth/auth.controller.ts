import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';

import {
  AcceptInviteDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { ok } from 'src/common/dto/api-response.dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

    
  }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto) {
    return ok(await this.authService.login(dto), 'Login successful');
  }

  

  @Post('accept-invite')
  @Public()
  async acceptInvite(@Body() dto: AcceptInviteDto) {
    return ok(await this.authService.acceptInvite(dto), 'Invite accepted');
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return ok(await this.authService.refresh(dto.refreshToken), 'Token refreshed');
  }

  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    return ok(await this.authService.logout(dto.refreshToken), 'Logged out');
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return ok(await this.authService.forgotPassword(dto.email), 'Password reset initiated');
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return ok(await this.authService.resetPassword(dto.token, dto.newPassword), 'Password updated');
  }
  
}
