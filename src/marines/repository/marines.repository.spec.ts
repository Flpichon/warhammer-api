import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { Marine } from '../schemas/marine.schema';
import { MarinesRepository } from './marines.repository';

const mockAggregate = jest.fn();

const mockMarineModel = {
  aggregate: mockAggregate,
};

describe('MarinesRepository', () => {
  let repository: MarinesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarinesRepository,
        {
          provide: getModelToken(Marine.name),
          useValue: mockMarineModel,
        },
      ],
    }).compile();

    repository = module.get<MarinesRepository>(MarinesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findDistinctChapters', () => {
    const ownerId = new Types.ObjectId().toHexString();
    const ownerObjectId = new Types.ObjectId(ownerId);

    it('should match on ownerId as ObjectId, group by chapter, sort and limit', async () => {
      const mockResults = [{ _id: 'Ultramarines' }, { _id: 'Blood Angels' }];
      mockAggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResults),
      });

      const result = await repository.findDistinctChapters({
        ownerId,
        limit: 10,
      });

      expect(mockAggregate).toHaveBeenCalledWith([
        { $match: { ownerId: ownerObjectId } },
        { $group: { _id: '$chapter' } },
        { $sort: { _id: 1 } },
        { $limit: 10 },
      ]);
      expect(result).toEqual(['Ultramarines', 'Blood Angels']);
    });

    it('should add a case-insensitive $regex filter on chapter when q is provided', async () => {
      mockAggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([{ _id: 'Ultramarines' }]),
      });

      await repository.findDistinctChapters({ ownerId, q: 'ultra', limit: 5 });

      expect(mockAggregate).toHaveBeenCalledWith([
        {
          $match: {
            ownerId: ownerObjectId,
            chapter: { $regex: 'ultra', $options: 'i' },
          },
        },
        { $group: { _id: '$chapter' } },
        { $sort: { _id: 1 } },
        { $limit: 5 },
      ]);
    });

    it('should return an empty array when no documents match', async () => {
      mockAggregate.mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });

      const result = await repository.findDistinctChapters({
        ownerId,
        limit: 10,
      });

      expect(result).toEqual([]);
    });

    it('should filter out non-string values from aggregate results', async () => {
      mockAggregate.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue([
            { _id: 'Ultramarines' },
            { _id: null },
            { _id: undefined },
          ]),
      });

      const result = await repository.findDistinctChapters({
        ownerId,
        limit: 10,
      });

      expect(result).toEqual(['Ultramarines']);
    });
  });
});
