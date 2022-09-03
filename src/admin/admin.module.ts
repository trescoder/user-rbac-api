import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/shared/repositories/repository.module';
import { UserModule } from 'src/user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [RepositoryModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
