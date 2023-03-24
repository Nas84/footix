import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn()
          }
        }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const expectedResult = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vamkiLCJzdWIiOiI1MzkzOWZkOS1hNGYzLTQyZDQtYTIzZi01YzRiMzcxNTk4YWIiLCJyb2xlIjoiVXNlciIsImlhdCI6MTY3MTc1MzE5NiwiZXhwIjoxNjcxNzU2Nzk2fQ.S6GX0OYV64Vli13sMonjheHsLeVHTLH5Pk-A-4op0eE'
    };
    const user = {
      username: 'moji',
      id: '53939fd9-a4f3-42d4-a23f-5c4b371598ab',
      role: 'User'
    };

    it('should return an access token', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      expect(await authController.login(user)).toBe(expectedResult);
    });
  });
});
