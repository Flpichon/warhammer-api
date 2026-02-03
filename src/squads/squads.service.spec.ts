import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { MarinesRepository } from '../marines/repository/marines.repository';
import { SquadsRepository } from './repository/squads.repository';
import { SquadsService } from './squads.service';

describe('SquadsService', () => {
  let service: SquadsService;

  let squadsRepository: {
    existsByIdAndOwner: jest.Mock;
    addMarineId: jest.Mock;
    findByIdAndOwner: jest.Mock;
  };

  let marinesRepository: {
    assignToSquadIfUnassignedOrSameSquad: jest.Mock;
    findSquadIdByIdAndOwner: jest.Mock;
    unsetSquadId: jest.Mock;
    findByIdAndOwner: jest.Mock;
  };

  const ownerId = 'owner-id';
  const squadId = 'squad-id';
  const marineId = 'marine-id';

  beforeEach(async () => {
    squadsRepository = {
      existsByIdAndOwner: jest.fn(),
      addMarineId: jest.fn(),
      findByIdAndOwner: jest.fn(),
    };

    marinesRepository = {
      assignToSquadIfUnassignedOrSameSquad: jest.fn(),
      findSquadIdByIdAndOwner: jest.fn(),
      unsetSquadId: jest.fn(),
      findByIdAndOwner: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SquadsService,
        { provide: SquadsRepository, useValue: squadsRepository },
        { provide: MarinesRepository, useValue: marinesRepository },
      ],
    }).compile();

    service = moduleRef.get(SquadsService);
  });

  it('assignMarine: happy path', async () => {
    const expectedSquad = { id: squadId, ownerId, marineIds: [marineId] };
    const expectedMarine = { id: marineId, ownerId, squadId };

    squadsRepository.existsByIdAndOwner.mockResolvedValueOnce(true);
    marinesRepository.assignToSquadIfUnassignedOrSameSquad.mockResolvedValueOnce(
      {
        matchedCount: 1,
        modifiedCount: 1,
      },
    );
    squadsRepository.addMarineId.mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 1,
    });

    squadsRepository.findByIdAndOwner.mockResolvedValueOnce(expectedSquad);
    marinesRepository.findByIdAndOwner.mockResolvedValueOnce(expectedMarine);

    await expect(
      service.assignMarine({ ownerId, squadId, marineId }),
    ).resolves.toEqual({ squad: expectedSquad, marine: expectedMarine });

    expect(squadsRepository.existsByIdAndOwner).toHaveBeenCalledWith({
      id: squadId,
      ownerId,
    });

    expect(
      marinesRepository.assignToSquadIfUnassignedOrSameSquad,
    ).toHaveBeenCalledWith({
      ownerId,
      marineId,
      squadId,
    });

    expect(squadsRepository.addMarineId).toHaveBeenCalledWith({
      ownerId,
      squadId,
      marineId,
    });

    expect(squadsRepository.findByIdAndOwner).toHaveBeenCalledWith({
      id: squadId,
      ownerId,
    });
    expect(marinesRepository.findByIdAndOwner).toHaveBeenCalledWith({
      id: marineId,
      ownerId,
    });
  });

  it('assignMarine: throws NotFoundException when squad missing', async () => {
    squadsRepository.existsByIdAndOwner.mockResolvedValueOnce(false);

    await expect(
      service.assignMarine({ ownerId, squadId, marineId }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(
      marinesRepository.assignToSquadIfUnassignedOrSameSquad,
    ).not.toHaveBeenCalled();
    expect(squadsRepository.addMarineId).not.toHaveBeenCalled();
  });

  it('assignMarine: throws NotFoundException when marine missing', async () => {
    squadsRepository.existsByIdAndOwner.mockResolvedValueOnce(true);
    marinesRepository.assignToSquadIfUnassignedOrSameSquad.mockResolvedValueOnce(
      {
        matchedCount: 0,
        modifiedCount: 0,
      },
    );
    marinesRepository.findSquadIdByIdAndOwner.mockResolvedValueOnce(null);

    await expect(
      service.assignMarine({ ownerId, squadId, marineId }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(squadsRepository.addMarineId).not.toHaveBeenCalled();
  });

  it('assignMarine: throws ConflictException when marine assigned to another squad', async () => {
    squadsRepository.existsByIdAndOwner.mockResolvedValueOnce(true);
    marinesRepository.assignToSquadIfUnassignedOrSameSquad.mockResolvedValueOnce(
      {
        matchedCount: 0,
        modifiedCount: 0,
      },
    );
    marinesRepository.findSquadIdByIdAndOwner.mockResolvedValueOnce({
      id: marineId,
      ownerId,
      squadId: 'other-squad-id',
    });

    await expect(
      service.assignMarine({ ownerId, squadId, marineId }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(squadsRepository.addMarineId).not.toHaveBeenCalled();
  });

  it('assignMarine: rolls back when squad update fails after marine update', async () => {
    squadsRepository.existsByIdAndOwner.mockResolvedValueOnce(true);
    marinesRepository.assignToSquadIfUnassignedOrSameSquad.mockResolvedValueOnce(
      {
        matchedCount: 1,
        modifiedCount: 1,
      },
    );
    squadsRepository.addMarineId.mockResolvedValueOnce({
      matchedCount: 0,
      modifiedCount: 0,
    });

    await expect(
      service.assignMarine({ ownerId, squadId, marineId }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(marinesRepository.unsetSquadId).toHaveBeenCalledWith({
      ownerId,
      marineId,
      squadId,
    });
  });

  it('assignMarine: idempotent when already assigned to this squad', async () => {
    const expectedSquad = { id: squadId, ownerId, marineIds: [marineId] };
    const expectedMarine = { id: marineId, ownerId, squadId };

    squadsRepository.existsByIdAndOwner.mockResolvedValueOnce(true);
    marinesRepository.assignToSquadIfUnassignedOrSameSquad.mockResolvedValueOnce(
      {
        matchedCount: 1,
        modifiedCount: 0,
      },
    );
    squadsRepository.addMarineId.mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 0,
    });

    squadsRepository.findByIdAndOwner.mockResolvedValueOnce(expectedSquad);
    marinesRepository.findByIdAndOwner.mockResolvedValueOnce(expectedMarine);

    await expect(
      service.assignMarine({ ownerId, squadId, marineId }),
    ).resolves.toEqual({ squad: expectedSquad, marine: expectedMarine });
  });
});
