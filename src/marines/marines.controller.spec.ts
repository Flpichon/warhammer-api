import { Test, TestingModule } from '@nestjs/testing';
import { MarinesController } from './marines.controller';

describe('MarinesController', () => {
  let controller: MarinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarinesController],
    }).compile();

    controller = module.get<MarinesController>(MarinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
