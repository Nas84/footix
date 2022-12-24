import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { MatchesController } from '../matches.controller';
import { MatchesService } from '../matches.service';


describe('MatchesController', () => {
  let matchesController: MatchesController;
  let matchesService: MatchesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [{
        provide: 'MatchRepository',
        useClass: Repository,
      }, MatchesService]
    }).compile();

    matchesController = module.get<MatchesController>(MatchesController);
    matchesService = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(matchesController).toBeDefined();
  });
});
