import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  StorageService as IStorageService,
  StorageSignedUploadUrlRequest,
  StorageUploadFileRequest,
} from './storage.interface';

@Injectable()
export class StorageService implements IStorageService {
  private readonly supabase: SupabaseClient;
  private readonly bucket: string;
  private readonly ttl: number;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = process.env.APP_STORAGE_SUPABASEURL!;
const serviceRoleKey = process.env.APP_STORAGE_SUPABASESERVICEKEY!;

    this.bucket = this.configService.get<string>('app.storage.bucket') ?? 'documents';
    this.ttl = this.configService.get<number>('app.storage.signedUrlTtlSeconds') ?? 600;
    this.supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async uploadFile(input: StorageUploadFileRequest): Promise<void> {
    const { error } = await this.supabase.storage.from(this.bucket).upload(input.key, input.file, {
      contentType: input.contentType,
      upsert: false,
    });

    if (error) {
      throw new InternalServerErrorException(`Storage upload failed: ${error.message}`);
    }
  }

  async getUploadSignedUrl(input: StorageSignedUploadUrlRequest): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUploadUrl(input.key, {
        upsert: input.upsert ?? false,
      });

    if (error || !data?.signedUrl) {
      throw new InternalServerErrorException(`Signed upload URL generation failed: ${error?.message ?? 'unknown error'}`);
    }

    return data.signedUrl;
  }

  async getDownloadSignedUrl(key: string): Promise<string> {
    const { data, error } = await this.supabase.storage.from(this.bucket).createSignedUrl(key, this.ttl);

    if (error || !data?.signedUrl) {
      throw new InternalServerErrorException(`Signed download URL generation failed: ${error?.message ?? 'unknown error'}`);
    }

    return data.signedUrl;
  }

  async deleteFile(key: string): Promise<void> {
    const { error } = await this.supabase.storage.from(this.bucket).remove([key]);
    if (error) {
      throw new InternalServerErrorException(`Storage delete failed: ${error.message}`);
    }
  }
}
