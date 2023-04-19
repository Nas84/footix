import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from '../matches.controller';
import { MatchesService } from '../matches.service';
import * as moment from 'moment';
import { NotFoundException } from '@nestjs/common';
import { CreateMatchDto, MatchDto } from '../dto';
import { TeamDto } from '../../teams/dto';

describe('MatchesController', () => {
  let matchesController: MatchesController;
  let matchesService: MatchesService;
  let matches: MatchDto[];
  let team: TeamDto;

  beforeAll(async () => {
    team = {
      id: '1',
      name: 'Team1',
      createdAt: moment().format(),
      updatedAt: moment().format()
    };

    matches = [
      {
        id: 'a264b9a9-b37c-4494-bb9f-58ee6be5a74e',
        home_team: team,
        home_score: 0,
        away_team: team,
        away_score: 0,
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        id: 'f01cea3c-1d94-4231-9696-571df0953cf0',
        home_team: team,
        home_score: 0,
        away_team: team,
        away_score: 0,
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    ];

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(matches),
            findOneById: jest.fn(),
            create: jest.fn().mockImplementation((match) =>
              Promise.resolve({
                ...match,
                id: 'id',
                home_score: 0,
                away_score: 0,
                createdAt: moment().format(),
                updatedAt: moment().format()
              })
            ),
            update: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    matchesController = module.get<MatchesController>(MatchesController);
    matchesService = module.get<MatchesService>(MatchesService);
  });

  describe('getAll', () => {
    it('should return all matches', async () => {
      expect(await matchesController.getAll()).toBe(matches);
    });
  });

  describe('getById', () => {
    it('should return a match', async () => {
      jest.spyOn(matchesService, 'findOneById').mockResolvedValue(matches[0]);
      expect(await matchesController.getById('1')).toBe(matches[0]);
    });

    it('should return 404 Not Found exception if match is not found', async () => {
      jest.spyOn(matchesService, 'findOneById').mockRejectedValue(new NotFoundException());
      await expect(async () => await matchesController.getById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a match', async () => {
      const match = new CreateMatchDto();
      match.home_team = '24c599df-5293-40f1-a706-019ece026932';
      match.away_team = '6ea72d21-3c0b-4323-b57f-b98bff5219da';

      expect(await matchesController.create(match)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          home_team: match.home_team,
          home_score: 0,
          away_team: match.away_team,
          away_score: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });

  describe('update', () => {
    it('should return 204 if the match is updated', async () => {
      jest.spyOn(matchesService, 'update').mockResolvedValue({ raw: [], affected: 1, generatedMaps: [] });
      expect(await matchesController.update('1', matches[0])).not.toBeDefined();
    });

    it('should return 404 Not Found if the match is not updated', async () => {
      jest.spyOn(matchesService, 'update').mockResolvedValue({ raw: [], affected: 0, generatedMaps: [] });
      await expect(async () => {
        await matchesController.update('3', matches[0]);
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should return 204 if the match is deleted', async () => {
      jest.spyOn(matchesService, 'delete').mockResolvedValue({ raw: [], affected: 1 });
      expect(await matchesController.delete('1')).not.toBeDefined();
    });

    it('should return 404 Not Found if the match is not deleted', async () => {
      jest.spyOn(matchesService, 'delete').mockResolvedValue({ raw: [], affected: 0 });
      await expect(async () => {
        await matchesController.delete('3');
      }).rejects.toThrow(NotFoundException);
    });
  });
});
