import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, SignupUserDto, UpdateUserDto, UserDto } from './dto/';
import { UserRole } from './user.role';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(userData: CreateUserDto | SignupUserDto): Promise<UserDto> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const user = new User();
    user.id = uuidv4();
    user.username = userData.username;
    user.password = passwordHash;
    user.role = 'role' in userData ? userData.role : UserRole.User;

    const savedUser = await this.usersRepository.save(user);

    return this.mapUserDto(savedUser);
  }

  async findOneById(id: string): Promise<UserDto> {
    const user = await this.usersRepository.findOneOrFail({ where: { id: id } });
    return this.mapUserDto(user);
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { username: username }
    });
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.mapUserDto(user));
  }

  async update(id: string, user: UpdateUserDto): Promise<UpdateResult> {
    user.id = id;
    return this.usersRepository.update(user.id, user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }

  private mapUserDto(user: User): UserDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userDto } = user;

    return <UserDto>userDto;
  }
}
