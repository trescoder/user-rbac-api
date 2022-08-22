import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryService } from './user-repository.service';

describe('UserRepositoryService', () => {
  let service: UserRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepositoryService],
    }).compile();

    service = module.get<UserRepositoryService>(UserRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
