import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Match } from './match.entity';

@Injectable()
export class MatchesService {

    constructor(
        @InjectRepository(Match)
        private matchesRepository: Repository<Match>
    ) { }

    async findAll(): Promise<Match[]> {
        return await this.matchesRepository.find();
    }

    async findOneById(id: string): Promise<any> {
        return await this.matchesRepository.findOneOrFail({where: {id: id} });
    }

    async create(match: Match): Promise<Match> {
        match.id = uuidv4();
        return await this.matchesRepository.save(match);
    }

    async update(id: string, match: Match): Promise<UpdateResult> {
        match.id = id;
        return await this.matchesRepository.update(match.id, match);
    }
    
    async delete(id: string): Promise<DeleteResult> {
        return await this.matchesRepository.delete(id);
    }
    
}
