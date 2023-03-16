import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from '../matches.controller';
import { MatchesService } from '../matches.service';
import { Match } from '../match.entity';
import * as moment from 'moment';
import { NotFoundException } from '@nestjs/common';

describe('MatchesController', () => {
  let matchesController: MatchesController;
  let matchesService: MatchesService;
  let matches: Match[];

  beforeAll(async () => {

    matches = [
      { id: '1', home_team: null, home_score: 0, away_team: null, away_score: 0, createdAt: moment().format(), updatedAt: moment().format() },
      { id: '2', home_team: null, home_score: 0, away_team: null, away_score: 0, createdAt: moment().format(), updatedAt: moment().format() },
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
            create: jest.fn().mockImplementation( (match) => Promise.resolve({
              ...match,
              id: 'id',
              createdAt: moment().format(),
              updatedAt: moment().format(),
            })),
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
      let match = new Match();
      match.home_score = 1;
      match.home_team = null;
      match.away_score = 2;
      match.away_team = null;

      expect(await matchesController.create(match)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          home_team: null,
          home_score: match.home_score,
          away_team: null,
          away_score: match.away_score,
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
      await expect(async () => { await matchesController.update('3', matches[0]) }).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should return 204 if the match is deleted', async () => {
      jest.spyOn(matchesService, 'delete').mockResolvedValue({ raw: [], affected: 1 });
      expect(await matchesController.delete('1')).not.toBeDefined();
    });

    it('should return 404 Not Found if the match is not deleted', async () => {
      jest.spyOn(matchesService, 'delete').mockResolvedValue({ raw: [], affected: 0 });
      await expect(async () => { await matchesController.delete('3') }).rejects.toThrow(NotFoundException);
    });
  });
});
