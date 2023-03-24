import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UserRole } from '../user.role';
import * as moment from 'moment';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersService: UsersService;
  let userController: UsersController;

  let users: User[];

  beforeAll(async () => {
    users = [
      {
        id: '1',
        username: 'admin',
        password: 'changeme',
        role: UserRole.Admin,
        createdAt: moment().format(),
        updatedAt: moment().format()
      },
      {
        id: '2',
        username: 'user',
        password: 'password',
        role: UserRole.User,
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(users),
            findOneById: jest.fn(),
            create: jest.fn().mockImplementation((user: User) =>
              Promise.resolve({
                id: 'id',
                createdAt: moment().format(),
                updatedAt: moment().format(),
                ...user
              })
            ),
            update: jest.fn(),
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    userController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await userController.findAll()).toBe(users);
    });
  });

  describe('findById', () => {
    it('should return a user if exists', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(users[0]);
      expect(await userController.findById('ad70f836-fc4c-40bd-8afd-ecc17c2cd4d7')).toBe(users[0]);
    });

    it('should return 404 Not Found exception if user is not found', async () => {
      jest.spyOn(usersService, 'findOneById').mockRejectedValue(new NotFoundException());

      await expect(async () => {
        await userController.findById('ad70f836-fc4c-40bd-8afd-ecc17c2cd4d7');
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('signup', () => {
    const user = new User();
    user.username = 'user';
    user.password = 'password';

    it('should return a user', async () => {
      expect(await userController.signup(user)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: user.username,
          password: expect.any(String),
          role: UserRole.User,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });

  describe('create', () => {
    const user = new User();
    user.username = 'admin';
    user.password = 'password';
    user.role = UserRole.Admin;

    it('should create and returned the saved user', async () => {
      expect(await userController.create(user)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: user.username,
          password: expect.any(String),
          role: user.role,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });

  describe('update', () => {
    const user: User = {
      id: 'id',
      username: 'user',
      password: 'password',
      role: UserRole.User,
      createdAt: '2023-02-28T22:44:26.000Z',
      updatedAt: '2023-02-28T22:44:26.000Z'
    };

    it('should return 204 No Content when user is successfully updated', async () => {
      jest.spyOn(usersService, 'update').mockResolvedValue({ raw: [], affected: 1, generatedMaps: [] });

      expect(await userController.update('ad70f836-fc4c-40bd-8afd-ecc17c2cd4d7', user)).not.toBeDefined();
    });

    it('should be return 404 Not Found when the no user is updated', async () => {
      jest.spyOn(usersService, 'update').mockResolvedValue({ raw: [], affected: 0, generatedMaps: [] });

      await expect(async () => {
        await userController.update('ad70f836-fc4c-40bd-8afd-ecc17c2cd4d7', user);
      }).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should be return 204 No Content when the user is successfully deleted', async () => {
      jest.spyOn(usersService, 'delete').mockResolvedValue({ raw: [], affected: 1 });
      expect(await userController.delete('1')).not.toBeDefined();
    });

    it('should be return 404 No Content when the no user is deleted', async () => {
      jest.spyOn(usersService, 'delete').mockResolvedValue({ raw: [], affected: 0 });

      await expect(async () => {
        await userController.delete('1');
      }).rejects.toThrow(NotFoundException);
    });
  });
});
