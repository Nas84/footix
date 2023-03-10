import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {

    constructor(
        @InjectRepository(Team)
        private teamsRepository: Repository<Team>
    ) { }

    async findAll(): Promise<Team[]> {
        return await this.teamsRepository.find();
    }

    async findOneById(id: string): Promise<any> {
        return await this.teamsRepository.findOneOrFail({where: {id: id} });
    }

    async create(team: Team): Promise<Team> {
        team.id = uuidv4();
        return await this.teamsRepository.save(team);
    }

    async update(id: string, team: Team): Promise<UpdateResult> {
        team.id = id;
        return await this.teamsRepository.update(team.id, team);
    }
    
    async delete(id: string): Promise<DeleteResult> {
        return await this.teamsRepository.delete(id);
    }
}
