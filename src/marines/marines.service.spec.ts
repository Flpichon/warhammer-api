import { Test, TestingModule } from '@nestjs/testing';
import { MarinesService } from './marines.service';

describe('MarinesService', () => {
  let service: MarinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarinesService],
    }).compile();

    service = module.get<MarinesService>(MarinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
