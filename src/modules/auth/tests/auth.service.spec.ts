import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service'

describe('AuthService', () => {
  let authService: AuthService;

  // @Module({})
  // class UsersModule {}
  // jest.mock('../../users/users.module', () => {
  //   return {
  //     UsersModule: {
  //       forRootAsync: jest.fn().mockImplementation(() => UsersModule),
  //     }
  //   };
  // });

  // @Module({})
  // class PassportModuleMock {}
  // jest.mock('@nestjs/passport', () => {
  //   return {
  //     PassportModule: {
  //       forRootAsync: jest.fn().mockImplementation(() => PassportModuleMock),
  //     }
  //   };
  // });

  // @Module({})
  // class JwtModuleMock {}
  // jest.mock('@nestjs/jwt', () => {
  //   return {
  //     PassportModule: {
  //       forRootAsync: jest.fn().mockImplementation(() => JwtModuleMock),
  //     }
  //   };
  // });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService, 
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(() => {})
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => {})
          }
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
