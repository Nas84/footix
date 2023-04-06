import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MatchesService } from '../matches.service';
import { Match } from '../match.entity';
import * as moment from 'moment';
import { CreateMatchDto, MatchDto, UpdateMatchDto } from '../dto';
import { Team } from '../../teams/team.entity';
import { TeamDto } from '../../teams/dto';

describe('MatchesService', () => {
  let matchesService: MatchesService;
  let matches: Match[];
  let team: Team;
  let matchesDto: MatchDto[];

  beforeAll(async () => {
    team = new Team();
    team.id = '1';
    team.name = 'HomeTeam';
    team.createdAt = moment().format();
    team.updatedAt = moment().format();

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

    matchesDto = await Promise.all(matches.map((match) => MatchDto.fromEntity(match)));

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
                createdAt: moment().format(),
                updatedAt: moment().format(),
                ...match
              })
            ),
            /* eslint-disable */
            update: jest
              .fn()
              .mockImplementation((id: string, user: Match) => Promise.resolve({ raw: [], affected: 1 })),
            delete: jest.fn().mockImplementation((id: string) => Promise.resolve({ raw: [], affected: 1 }))
            /* eslint-enable */
          }
        },
        {
          provide: getRepositoryToken(Team),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(team)
          }
        }
      ]
    }).compile();

    matchesService = module.get<MatchesService>(MatchesService);
  });

  describe('findAll', () => {
    it('should return an array of MatchDto', async () => {
      expect(await matchesService.findAll()).toStrictEqual(matchesDto);
    });
  });

  describe('findOneById', () => {
    it('should return one MatchDto', async () => {
      expect(await matchesService.findOneById('1')).toStrictEqual(matchesDto[0]);
    });
  });

  describe('create', () => {
    it('should return a MatchDto', async () => {
      const match = new CreateMatchDto();
      match.home_team = '24c599df-5293-40f1-a706-019ece026932';
      match.away_team = '6ea72d21-3c0b-4323-b57f-b98bff5219da';

      expect(await matchesService.create(match)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          home_team: expect.any(TeamDto),
          home_score: 0,
          away_team: expect.any(TeamDto),
          away_score: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });

  describe('update', () => {
    it('should return an UpdateResult with one raw affected', async () => {
      const match = new UpdateMatchDto();
      match.home_score = 1;
      match.away_score = 3;

      expect(await matchesService.update('1', match)).toEqual(
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
