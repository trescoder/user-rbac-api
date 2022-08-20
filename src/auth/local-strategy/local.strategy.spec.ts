import { Test, TestingModule } from '@nestjs/testing';
import { Local } from './local.strategy';

describe('Local', () => {
  let provider: Local;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Local],
    }).compile();

    provider = module.get<Local>(Local);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
