import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from '../matches.controller';
import { MatchesService } from '../matches.service';
import { Match } from '../match.entity';
import * as moment from 'moment';

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
            findOneById: jest.fn().mockResolvedValue(matches[0]),
            create: jest.fn().mockImplementation( (match) => Promise.resolve({
              ...match,
              id: 'id',
              createdAt: moment().format(),
              updatedAt: moment().format(),
            })),
            update: jest.fn().mockImplementation((id: string, match: Match) => 
              Promise.resolve({ raw: [], affected: 1 })
            ),
            delete: jest.fn().mockImplementation((id: string) => 
              Promise.resolve({ raw: [], affected: 1 })
            )
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
      expect(await matchesController.getById('1')).toBe(matches[0]);
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
    it('should return an UpdateResult with one affected row', async () => {
      expect(await matchesController.update('1', matches[0])).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });

  describe('delete', () => {
    it('should return a DeleteResult with one affected row', async () => {
      expect(await matchesController.delete('1')).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });
});
