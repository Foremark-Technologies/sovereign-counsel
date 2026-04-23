import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  matterId!: string;

  @IsString()
  @IsOptional()
  folderId?: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @Matches(/^(application\/pdf|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|image\/.*)$/)
  mimeType!: string;

  @IsInt()
  @Min(1)
  sizeBytes!: number;
}
