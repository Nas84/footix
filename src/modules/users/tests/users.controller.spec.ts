import { Test, TestingModule } from '@nestjs/testing';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let usersService: UsersService;
  let userController: UsersController;
  

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide: 'UserRepository',
        useClass: Repository,
      }, UsersService]
    }).compile();

    userController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResult = [new User()];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(expectedResult);
      
      expect(await userController.findAll()).toBe(expectedResult);
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      const expectedResult = new User();

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(expectedResult);
      
      expect(await userController.findById('ad70f836-fc4c-40bd-8afd-ecc17c2cd4d7')).toBe(expectedResult);
    });
  });

  describe('create', () => {
    const expectedResult = new User();
    const user = new User();

    it('should create and returned the saved user', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue(expectedResult);

      expect(await userController.create(user)).toBe(expectedResult);
    });
  });

  describe('update', () => {
    it('should return the updated user', async () => {
      const expectedResult = new UpdateResult();
      const user = new User();

      jest.spyOn(usersService, 'update').mockResolvedValue(expectedResult);

      expect(await userController.update('ad70f836-fc4c-40bd-8afd-ecc17c2cd4d7', user)).toBe(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete the user', async () => {

    });
  });
});
