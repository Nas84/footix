import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamsService } from '../teams.service';
import { Team } from '../team.entity';
import * as moment from 'moment';

describe('TeamsService', () => {
  let teamsService: TeamsService;
  let teams: Team[];
  
  beforeAll(async () => {
    
    teams = [
      { id: '1', name: 'Team1', createdAt: moment().format(), updatedAt: moment().format() },
      { id: '2', name: 'Team2', createdAt: moment().format(), updatedAt: moment().format() }
    ];
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: {
            find: jest.fn().mockResolvedValue(teams),
            findOneOrFail: jest.fn().mockResolvedValue(teams[0]),
            save: jest.fn().mockImplementation((team: Team) => 
              Promise.resolve({
                id: 'id',
                createdAt: moment().format(),
                updatedAt: moment().format(),
                ...team
              })
            ),
            update: jest.fn().mockImplementation((id: string, team: Team) => 
              Promise.resolve({ raw: [], affected: 1 })
            ),
            delete: jest.fn().mockImplementation((id: string) => 
              Promise.resolve({ raw: [], affected: 1 })
            )
          }
        }
      ]
    }).compile();

    teamsService = module.get<TeamsService>(TeamsService);
  });

  describe('findAll', () => {
    it('should return all teams', async () => {
      expect(await teamsService.findAll()).toBe(teams);
    });
  });

  describe('findOneById', () => {
    it('should return one team', async () => {
      expect(await teamsService.findOneById('1')).toBe(teams[0]);;
    });
  });

  describe('create', () => {
    it('should return a team', async () => {
      let team: Team = new Team();
      team.name = "Team";

      expect(await teamsService.create(team)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: team.name,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });

  describe('update', () => {
    it('should return an UpdateResult with one raw affected', async () => {
      let team: Team = {
        id: 'id',
        name: "Team",
        createdAt: "2023-02-28T22:44:26.000Z",
        updatedAt: "2023-02-28T22:44:26.000Z"
      }

      expect(await teamsService.update(team.id, team)).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });

  describe('delete', () => {
    it('should return an DeleteResult with one raw affected', async () => {
      expect(await teamsService.delete('1')).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });
});
