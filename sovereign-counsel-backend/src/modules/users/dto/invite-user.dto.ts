import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  roleId!: string;

  @IsString()
  @IsOptional()
  organizationId?: string;
}
