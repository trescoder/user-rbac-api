import { Test, TestingModule } from '@nestjs/testing';
import { PostRepositoryService } from './post-repository.service';

describe('PostRepositoryService', () => {
  let service: PostRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostRepositoryService],
    }).compile();

    service = module.get<PostRepositoryService>(PostRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
