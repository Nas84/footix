import { Test, TestingModule } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { TeamsController } from '../teams.controller';
import { TeamsService } from '../teams.service'

describe('TeamsController', () => {
  let teamsService: TeamsService;
  let teamsController: TeamsController;
  

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [{
        provide: 'TeamRepository',
        useClass: Repository,
      }, TeamsService]
    }).compile();

    teamsController = module.get<TeamsController>(TeamsController);
    teamsService = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(teamsController).toBeDefined();
  });
});
