import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MatchesService } from '../matches.service';
import { Match } from '../match.entity';
import * as moment from 'moment';

describe('MatchesService', () => {
  let matchesService: MatchesService;
  let matches: Match[];

  beforeAll(async () => {

    matches = [
      { id: '1', home_team: null, home_score: 0, away_team: null, away_score: 0, createdAt: moment().format(), updatedAt: moment().format() },
      { id: '2', home_team: null, home_score: 0, away_team: null, away_score: 0, createdAt: moment().format(), updatedAt: moment().format() },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useValue: {
            find: jest.fn().mockResolvedValue(matches),
            findOneOrFail: jest.fn().mockResolvedValue(matches[0]),
            save: jest.fn().mockImplementation((match: Match) => 
              Promise.resolve({
                id: 'id',
                createdAt: moment().format(),
                updatedAt: moment().format(),
                ...match
              })
            ),
            update: jest.fn().mockImplementation((id: string, user: Match) => 
              Promise.resolve({ raw: [], affected: 1 })
            ),
            delete: jest.fn().mockImplementation((id: string) => 
              Promise.resolve({ raw: [], affected: 1 })
            )
          }
        }, 
      ]
    }).compile();

    matchesService = module.get<MatchesService>(MatchesService);
  });

  describe('findAll', () => {
    it('should return one team', async () => {
      expect(await matchesService.findAll()).toBe(matches);;
    });
  });

  describe('findOneById', () => {
    it('should return one team', async () => {
      expect(await matchesService.findOneById('1')).toBe(matches[0]);;
    });
  });

  describe('create', () => {
    it('should return a team', async () => {
      let match: Match = new Match();
      match.home_score = 1;
      match.home_team = null;
      match.away_score = 2;
      match.away_team = null;

      expect(await matchesService.create(match)).toEqual(
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
    it('should return an UpdateResult with one raw affected', async () => {
      expect(await matchesService.update(matches[0].id, matches[0])).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });

  describe('delete', () => {
    it('should return an DeleteResult with one raw affected', async () => {
      expect(await matchesService.delete('1')).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });
});
