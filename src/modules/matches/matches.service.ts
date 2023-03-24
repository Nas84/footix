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
  ) {}

  async findAll(): Promise<Match[]> {
    return this.matchesRepository.find();
  }

  async findOneById(id: string): Promise<any> {
    return this.matchesRepository.findOneOrFail({ where: { id: id } });
  }

  async create(match: Match): Promise<Match> {
    match.id = uuidv4();
    return this.matchesRepository.save(match);
  }

  async update(id: string, match: Match): Promise<UpdateResult> {
    match.id = id;
    return this.matchesRepository.update(match.id, match);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.matchesRepository.delete(id);
  }
}
