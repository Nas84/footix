import { Test, TestingModule } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { UsersService } from '../users.service';

describe('UserService', () => {
  let usersService: UsersService;  

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [{
        provide: 'UserRepository',
        useClass: Repository,
      }, UsersService]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
