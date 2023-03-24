import { Test, TestingModule } from '@nestjs/testing';
import { Team } from '../team.entity';
import { TeamsController } from '../teams.controller';
import { TeamsService } from '../teams.service';
import * as moment from 'moment';
import { NotFoundException } from '@nestjs/common';

describe('TeamsController', () => {
  let teamsService: TeamsService;
  let teamsController: TeamsController;
  let teams: Team[];

  beforeAll(async () => {
    teams = [
      {
        id: '1',
        name: 'Team1',
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        id: '2',
        name: 'Team2',
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(teams),
            findOneById: jest.fn(),
            create: jest.fn().mockImplementation((team: Team) =>
              Promise.resolve({
                id: 'id',
                createdAt: moment().format(),
                updatedAt: moment().format(),
                ...team
              })
            ),
            update: jest.fn(),
            delete: jest.fn()
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
    it('should be return a team', async () => {
      jest.spyOn(teamsService, 'findOneById').mockResolvedValue(teams[0]);

      expect(await teamsController.getById('1')).toBe(teams[0]);
    });

    it('should be return 404 Not Found Exception if no team is found', async () => {
      jest.spyOn(teamsService, 'findOneById').mockRejectedValue(new NotFoundException());

      // eslint-disable-next-line prettier/prettier
      await expect(async () => {
        await teamsController.getById('1');
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should return a team', async () => {
      const team: Team = new Team();
      team.name = 'Team';

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
    const team: Team = {
      id: 'id',
      name: 'Team',
      createdAt: '2023-02-28T22:44:26.000Z',
      updatedAt: '2023-02-28T22:44:26.000Z'
    };

    it('should be return 204 No Content when team is successfully updated', async () => {
      jest.spyOn(teamsService, 'update').mockResolvedValue({ raw: [], affected: 1, generatedMaps: [] });

      expect(await teamsController.update('1', team)).not.toBeDefined();
    });

    it('should be return 404 Not Found Exception if no team update', async () => {
      jest.spyOn(teamsService, 'update').mockResolvedValue({ raw: [], affected: 0, generatedMaps: [] });

      // eslint-disable-next-line prettier/prettier
      await expect(async () => {
        await teamsController.update('1', team);
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should be return 204 No Content when team is successfully deleted', async () => {
      jest.spyOn(teamsService, 'delete').mockResolvedValue({ raw: [], affected: 1 });

      expect(await teamsController.delete('1')).not.toBeDefined();
    });

    it('should be return 404 Not Found Exception if no team deleted', async () => {
      jest.spyOn(teamsService, 'delete').mockResolvedValue({ raw: [], affected: 0 });

      // eslint-disable-next-line prettier/prettier
      await expect(async () => {
        await teamsController.delete('1');
      }).rejects.toThrow(NotFoundException);
    });
  });
});
