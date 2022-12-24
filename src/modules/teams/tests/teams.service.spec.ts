import { Test, TestingModule } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { TeamsService } from '../teams.service';

describe('TeamsService', () => {
  let teamsService: TeamsService;
  

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [{
        provide: 'TeamRepository',
        useClass: Repository,
      }, TeamsService]
    }).compile();

    teamsService = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(teamsService).toBeDefined();
  });
});
