import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { UserRole } from '../user.role'
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

describe('UserService', () => {
  let usersService: UsersService;

  let users: User[];

  beforeAll(async () => {

    users  = [
      { id: '1', username: 'admin', password: 'changeme', role: UserRole.Admin, createdAt: moment().format(), updatedAt: moment().format() },
      { id: '2', username: 'user', password: 'password', role: UserRole.User, createdAt: moment().format(), updatedAt: moment().format() }
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(users),
            findOne: jest.fn().mockResolvedValue(users[0]),
            save: jest.fn().mockImplementation((user: User) => 
              Promise.resolve({
                id: 'id',
                createdAt: moment().format(),
                updatedAt: moment().format(),
                ...user
              })
            ),
            update: jest.fn().mockImplementation((id: string, user: User) => 
              Promise.resolve({ raw: [], affected: 1 })
            ),
            delete: jest.fn().mockImplementation((id: string) => 
              Promise.resolve({ raw: [], affected: 1 })
            )
          }
        }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return one team', async () => {
      expect(await usersService.findAll()).toBe(users);;
    });
  });

  describe('findOneById', () => {
    it('should return one team', async () => {
      expect(await usersService.findOneById('1')).toBe(users[0]);;
    });
  });

  describe('findOneByUsername', () => {
    it('should return one team', async () => {
      expect(await usersService.findOneByUsername('admin')).toBe(users[0]);;
    });
  });

  describe('create', () => {
    it('should return a team', async () => {
      let user: User = new User();
      user.username = "Team";

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
      let user: User = {
        id: 'id',
        username: "user",
        password: "password",
        role: UserRole.Admin,
        createdAt: "2023-02-28T22:44:26.000Z",
        updatedAt: "2023-02-28T22:44:26.000Z"
      }

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
