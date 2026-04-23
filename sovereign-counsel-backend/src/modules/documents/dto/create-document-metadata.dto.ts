import { IsNotEmpty, IsString } from 'class-validator';
import { UploadDocumentDto } from './upload-document.dto';

export class CreateDocumentMetadataDto extends UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  storageKey!: string;
}
