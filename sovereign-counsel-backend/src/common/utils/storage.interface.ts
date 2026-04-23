export interface StorageUploadRequest {
  key: string;
  contentType: string;
}

export interface StorageSignedUploadUrlRequest extends StorageUploadRequest {
  upsert?: boolean;
}

export interface StorageUploadFileRequest extends StorageUploadRequest {
  file: Buffer;
}

export interface StorageService {
  uploadFile(input: StorageUploadFileRequest): Promise<void>;
  getUploadSignedUrl(input: StorageSignedUploadUrlRequest): Promise<string>;
  getDownloadSignedUrl(key: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
}
