import { Test, TestingModule } from '@nestjs/testing';
import { LikeRepositoryService } from './like-repository.service';

describe('LikeRepositoryService', () => {
  let service: LikeRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeRepositoryService],
    }).compile();

    service = module.get<LikeRepositoryService>(LikeRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
