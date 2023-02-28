import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService, 
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => { return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vamkiLCJzdWIiOiI1MzkzOWZkOS1hNGYzLTQyZDQtYTIzZi01YzRiMzcxNTk4YWIiLCJyb2xlIjoiVXNlciIsImlhdCI6MTY3MTc1MzE5NiwiZXhwIjoxNjcxNzU2Nzk2fQ.S6GX0OYV64Vli13sMonjheHsLeVHTLH5Pk-A-4op0eE'})
          }
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const expectedResult = { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vamkiLCJzdWIiOiI1MzkzOWZkOS1hNGYzLTQyZDQtYTIzZi01YzRiMzcxNTk4YWIiLCJyb2xlIjoiVXNlciIsImlhdCI6MTY3MTc1MzE5NiwiZXhwIjoxNjcxNzU2Nzk2fQ.S6GX0OYV64Vli13sMonjheHsLeVHTLH5Pk-A-4op0eE'};
      const user = {username: 'moji', id: '53939fd9-a4f3-42d4-a23f-5c4b371598ab', role: 'User'};
      
      expect(await authService.login(user)).toEqual(expectedResult);
    });
  });

  describe('validateUser', () => {
    it('should return a User when username and password match an existing user', async () => {
      const expectedResult: User = new User();

      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(expectedResult);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      expect(await authService.validateUser('user', 'password')).toEqual(expectedResult);
    });

    it('should return null when username is not found', async () => {
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(null);

      expect(await authService.validateUser('user', 'password')).toBe(null);
    });

    it('should return null when password doesn\'t match', async () => {
      jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(new User());
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      expect(await authService.validateUser('user', 'password')).toBe(null);
    });
  });
});
