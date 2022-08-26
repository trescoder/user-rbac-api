import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/shared/repositories/repository.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [RepositoryModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
