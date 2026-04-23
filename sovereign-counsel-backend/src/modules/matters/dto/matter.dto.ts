import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum MatterStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  ON_HOLD = 'ON_HOLD',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum MatterVisibilityLevel {
  PRIVATE = 'PRIVATE',
  TEAM = 'TEAM',
  ORG = 'ORG',
}

export class CreateMatterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  matterTitle?: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  practiceArea?: string;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  court?: string;

  @IsDateString()
  @IsOptional()
  nextHearingDate?: string;

  @IsDateString()
  @IsOptional()
  nextDeadline?: string;

  @IsEnum(MatterVisibilityLevel)
  @IsOptional()
  visibilityLevel?: MatterVisibilityLevel;
}

export class UpdateMatterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(MatterStatus)
  @IsOptional()
  status?: MatterStatus;

  @IsDateString()
  @IsOptional()
  nextHearingDate?: string;

  @IsDateString()
  @IsOptional()
  nextDeadline?: string;
}

export class AssignMatterUserDto {
  @IsString()
  @IsNotEmpty()
  matterId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsOptional()
  role?: string;
}

export class CreateHearingDto {
  @IsString()
  @IsNotEmpty()
  matterId!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsOptional()
  court?: string;
}
