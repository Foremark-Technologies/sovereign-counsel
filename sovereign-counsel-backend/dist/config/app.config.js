"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 4000),
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET ?? '',
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },
    storage: {
        supabaseUrl: process.env.SUPABASE_URL ?? '',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ?? '',
        bucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'documents',
        signedUrlTtlSeconds: Number(process.env.STORAGE_SIGNED_URL_TTL_SECONDS ?? 600),
    },
}));
