import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../../users/user.role';
import { JwtStrategy } from '../jwt.strategy';

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                JwtStrategy
            ]
          }).compile();
          
          jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    });

    describe('validate', () => {
        it('', async () => {
            let payload = {
                sub: '',
                username: 'admin',
                role: UserRole.Admin,
            };
            expect(await jwtStrategy.validate(payload)).toEqual(
                expect.objectContaining({
                    userId: payload.sub,
                    username: payload.username,
                    role: payload.role
                })
            );
        });
    });
});