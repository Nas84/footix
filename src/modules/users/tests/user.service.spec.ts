import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { UserRole } from '../user.role';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

describe('UserService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

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
      controllers: [],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(users),
            findOneOrFail: jest.fn(),
            save: jest.fn().mockImplementation((user: User) =>
              Promise.resolve({
                id: 'id',
                createdAt: moment().format(),
                updatedAt: moment().format(),
                ...user
              })
            ),
            /* eslint-disable */
            update: jest.fn().mockImplementation((id: string, user: User) => Promise.resolve({ raw: [], affected: 1 })),
            delete: jest.fn().mockImplementation((id: string) => Promise.resolve({ raw: [], affected: 1 }))
            /* eslint-enable */
          }
        }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      expect(await usersService.findAll()).toBe(users);
    });
  });

  describe('findOneById', () => {
    it('should return a user', async () => {
      jest.spyOn(usersRepository, 'findOneOrFail').mockResolvedValue(users[0]);
      expect(await usersService.findOneById('1')).toBe(users[0]);
    });

    it('should reject the promise if the user is not found', async () => {
      const id = '16763be4-6022-406e-a950-fcd5018633ca';
      jest.spyOn(usersRepository, 'findOneOrFail').mockRejectedValue(`User ${id} not found`);
      await expect(async () => {
        await usersService.findOneById(id);
      }).rejects.toEqual(`User ${id} not found`);
    });
  });

  describe('findOneByUsername', () => {
    it('should return one user', async () => {
      jest.spyOn(usersRepository, 'findOneOrFail').mockResolvedValue(users[0]);
      expect(await usersService.findOneByUsername('admin')).toBe(users[0]);
    });
  });

  describe('create', () => {
    it('should return a user', async () => {
      const user: User = new User();
      user.username = 'User';

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      jest.spyOn(bcrypt, 'hash').mockImplementation((data, salt) => Promise.resolve(''));

      expect(await usersService.create(user)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: user.username,
          password: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      );
    });
  });

  describe('update', () => {
    it('should return an UpdateResult with one raw affected', async () => {
      const user: User = {
        id: 'id',
        username: 'user',
        password: 'password',
        role: UserRole.Admin,
        createdAt: '2023-02-28T22:44:26.000Z',
        updatedAt: '2023-02-28T22:44:26.000Z'
      };

      expect(await usersService.update(user.id, user)).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });

  describe('delete', () => {
    it('should return an DeleteResult with one raw affected', async () => {
      expect(await usersService.delete('1')).toEqual(
        expect.objectContaining({
          raw: expect.any(Array),
          affected: 1
        })
      );
    });
  });
});
