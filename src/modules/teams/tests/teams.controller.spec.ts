import { Test, TestingModule } from '@nestjs/testing';
import { Team } from '../team.entity';
import { TeamsController } from '../teams.controller';
import { TeamsService } from '../teams.service';
import * as moment from 'moment';

describe('TeamsController', () => {
  let teamsService: TeamsService;
  let teamsController: TeamsController;
  let teams: Team[];

  beforeAll(async () => {

    teams = [
      { id: '1', name: 'Team1', createdAt: moment().format(), updatedAt: moment().format() },
      { id: '2', name: 'Team2', createdAt: moment().format(), updatedAt: moment().format() }
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(teams),
            findOneById: jest.fn().mockResolvedValue(teams[0]),
            create: jest.fn().mockImplementation((team: Team) => 
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

    teamsController = module.get<TeamsController>(TeamsController);
    teamsService = module.get<TeamsService>(TeamsService);
  });

  describe('getAll', () => {
    it('should return all teams', async () => {
      expect(await teamsController.getAll()).toBe(teams);
    });
  });
  
  describe('getById', () => {
    it('should return a team', async () => {
      expect(await teamsController.getById('1')).toBe(teams[0]);
    });
  });

  describe('create', () => {
    it('should return a team', async () => {
      let team: Team = new Team();
      team.name = "Team";

      expect(await teamsController.create(team)).toEqual(
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
    it('should be return an UpdateResult with one affected row', async () => {
      let team: Team = {
        id: 'id',
        name: "Team",
        createdAt: "2023-02-28T22:44:26.000Z",
        updatedAt: "2023-02-28T22:44:26.000Z"
      }

      expect(await teamsController.update(team.id, team)).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });

  describe('delete', () => {
    it('should be return a DeleteResult with one affected row', async () => {
      expect(await teamsController.delete('1')).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });
});
