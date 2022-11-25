import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    async create(user: User): Promise<User> {
        user.id = uuidv4();
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        return await this.usersRepository.save(user);
    }

    async findOneById(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({where: {id: id}});
    }

    async findOneByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({where: {username: username}});
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async update(id: string, user: User): Promise<UpdateResult> {
        user.id = id;
        return await this.usersRepository.update(user.id, user);
    }
    
    async delete(id: string): Promise<DeleteResult> {
        return await this.usersRepository.delete(id);
    }

}
