import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/common/utils/storage.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async uploadAndCreateMetadata(dto: UploadDocumentDto, file: { buffer: Buffer }, user: any) {
    await this.assertMatterAccess(dto.matterId, user);
    if (!file?.buffer?.length) {
      throw new BadRequestException('File is required');
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

  async generateSignedUploadUrl(dto: UploadDocumentDto, user: any) {
    await this.assertMatterAccess(dto.matterId, user);
    const key = `${user.organizationId}/${dto.matterId}/${Date.now()}-${dto.fileName}`;
    const uploadUrl = await this.storageService.getUploadSignedUrl({
      key,
      contentType: dto.mimeType,
      upsert: false,
    });

    return { uploadUrl, storageKey: key };
  }

  async createMetadataFromUploadedFile(dto: UploadDocumentDto, storageKey: string, user: any) {
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

  async findAll(organizationId: string, matterId?: string) {
    const documents = await this.prisma.document.findMany({
      where: { organizationId, ...(matterId ? { matterId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
    return Promise.all(
      documents.map(async (document: any) => ({
        ...document,
        fileUrl: await this.storageService.getDownloadSignedUrl(document.storageKey),
      })),
    );
  }

  async getSignedDownloadUrl(documentId: string, user: any) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, organizationId: user.organizationId },
      include: { matter: { select: { id: true, createdById: true } } },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.assertMatterAccess(document.matterId, user);
    return {
      documentId: document.id,
      fileUrl: await this.storageService.getDownloadSignedUrl(document.storageKey),
    };
  }

  async delete(documentId: string, user: any) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, organizationId: user.organizationId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    await this.assertMatterAccess(document.matterId, user);

    await this.storageService.deleteFile(document.storageKey);
    await this.prisma.document.delete({ where: { id: documentId } });

    return { deleted: true };
  }

  private async assertMatterAccess(matterId: string, user: any): Promise<void> {
    const matter = await this.prisma.matter.findFirst({
      where: {
        id: matterId,
        organizationId: user.organizationId,
        OR: [{ createdById: user.sub }, { assignees: { some: { userId: user.sub } } }],
      },
      select: { id: true },
    });

    if (!matter) {
      throw new ForbiddenException('You do not have access to this matter');
    }
  }
}
