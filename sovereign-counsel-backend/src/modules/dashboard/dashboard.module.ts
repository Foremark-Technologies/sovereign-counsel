import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../auth/auth.module';
import { MattersModule } from '../matters/matters.module';

@Module({
  imports: [AuthModule, MattersModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
