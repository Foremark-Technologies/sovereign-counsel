import { Module } from '@nestjs/common';
import { MattersController } from './matters.controller';
import { MattersService } from './matters.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule, // ✅ ADD THIS
  ],
  controllers: [MattersController],
  providers: [MattersService],
  exports: [MattersService],
})
export class MattersModule {}
