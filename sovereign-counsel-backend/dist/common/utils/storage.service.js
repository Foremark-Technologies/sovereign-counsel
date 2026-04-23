"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let StorageService = class StorageService {
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = process.env.APP_STORAGE_SUPABASEURL;
        const serviceRoleKey = process.env.APP_STORAGE_SUPABASESERVICEKEY;
        this.bucket = this.configService.get('app.storage.bucket') ?? 'documents';
        this.ttl = this.configService.get('app.storage.signedUrlTtlSeconds') ?? 600;
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    async uploadFile(input) {
        const { error } = await this.supabase.storage.from(this.bucket).upload(input.key, input.file, {
            contentType: input.contentType,
            upsert: false,
        });
        if (error) {
            throw new common_1.InternalServerErrorException(`Storage upload failed: ${error.message}`);
        }
    }
    async getUploadSignedUrl(input) {
        const { data, error } = await this.supabase.storage
            .from(this.bucket)
            .createSignedUploadUrl(input.key, {
            upsert: input.upsert ?? false,
        });
        if (error || !data?.signedUrl) {
            throw new common_1.InternalServerErrorException(`Signed upload URL generation failed: ${error?.message ?? 'unknown error'}`);
        }
        return data.signedUrl;
    }
    async getDownloadSignedUrl(key) {
        const { data, error } = await this.supabase.storage.from(this.bucket).createSignedUrl(key, this.ttl);
        if (error || !data?.signedUrl) {
            throw new common_1.InternalServerErrorException(`Signed download URL generation failed: ${error?.message ?? 'unknown error'}`);
        }
        return data.signedUrl;
    }
    async deleteFile(key) {
        const { error } = await this.supabase.storage.from(this.bucket).remove([key]);
        if (error) {
            throw new common_1.InternalServerErrorException(`Storage delete failed: ${error.message}`);
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
