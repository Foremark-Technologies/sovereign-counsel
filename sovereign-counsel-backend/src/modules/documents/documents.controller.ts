import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { ok } from 'src/common/dto/api-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentMetadataDto } from './dto/create-document-metadata.dto';

@Controller('documents')
@UseGuards(JwtAuthGuard, RbacGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-url')
  @Permissions('documents:create')
  async generateUploadUrl(@Body() dto: UploadDocumentDto, @Req() req: any) {
    return ok(await this.documentsService.generateSignedUploadUrl(dto, req.user));
  }

  @Post('upload')
  @Permissions('documents:create')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: { buffer: Buffer },
    @Req() req: any,
  ) {
    return ok(await this.documentsService.uploadAndCreateMetadata(dto, file, req.user));
  }

  @Post('metadata')
  @Permissions('documents:create')
  async createMetadata(@Body() dto: CreateDocumentMetadataDto, @Req() req: any) {
    return ok(await this.documentsService.createMetadataFromUploadedFile(dto, dto.storageKey, req.user));
  }

  @Get()
  @Permissions('documents:read')
  async list(@Req() req: any, @Query('matterId') matterId?: string) {
    return ok(await this.documentsService.findAll(req.user.organizationId, matterId));
  }

  @Get(':id/download-url')
  @Permissions('documents:read')
  async getDownloadUrl(@Param('id') id: string, @Req() req: any) {
    return ok(await this.documentsService.getSignedDownloadUrl(id, req.user));
  }

  @Delete(':id')
  @Permissions('documents:delete')
  async remove(@Param('id') id: string, @Req() req: any) {
    return ok(await this.documentsService.delete(id, req.user));
  }
}
