import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm'
import { MatchesService } from '../matches.service';

describe('MatchesService', () => {
  let matchesService: MatchesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [{
        provide: 'MatchRepository',
        useClass: Repository,
      }, MatchesService]
    }).compile();

    matchesService = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(matchesService).toBeDefined();
  });
});
