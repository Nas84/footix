import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { LocalStrategy } from '../local.strategy';
import { UnauthorizedException } from '@nestjs/common'; 
import { join } from 'path';

describe('LocalStrategy', () => {
    let localStrategy: LocalStrategy;
    let authService: AuthService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
              LocalStrategy,
              {
                provide: AuthService,
                useValue: {
                  validateUser: jest.fn()
                }
              }
            ]
          }).compile();
          
          localStrategy = module.get<LocalStrategy>(LocalStrategy);
          authService = module.get<AuthService>(AuthService);
    });

    describe('validate', () => {
      it('should validate the username and password', async () => {
        jest.spyOn(authService, 'validateUser').mockResolvedValue( { username: 'admin', password: 'changeme' } );

        expect(await localStrategy.validate('admin', 'changeme')).toBeDefined();
      });

      it('should throw UnauthorizedException if the username and password don\'t match ', async () => {
        jest.spyOn(authService, 'validateUser').mockResolvedValue( null );

        await expect(async () => { await localStrategy.validate('user', '') }).rejects.toThrow(UnauthorizedException);
      });
    });
});