import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Team } from '../teams/team.entity';
import { CreateMatchDto, MatchDto, UpdateMatchDto } from './dto';
import { Match } from './match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>
  ) {}

  async findAll(): Promise<MatchDto[]> {
    const matches = await this.matchesRepository.find({
      relations: { home_team: true, away_team: true }
    });

    return await Promise.all(
      matches.map(async (match) => {
        return await MatchDto.fromEntity(match);
      })
    );
  }

  async findOneById(id: string): Promise<MatchDto> {
    const match = await this.matchesRepository.findOneOrFail({
      where: { id: id },
      relations: { home_team: true, away_team: true }
    });
    return await MatchDto.fromEntity(match);
  }

  async create(matchData: CreateMatchDto): Promise<MatchDto> {
    const match = new Match();
    match.id = uuidv4();

    match.home_team = await this.teamsRepository.findOneOrFail({ where: { id: matchData.home_team } });
    match.home_score = 0;

    match.away_team = await this.teamsRepository.findOneOrFail({ where: { id: matchData.away_team } });
    match.away_score = 0;

    const savedMatch = await this.matchesRepository.save(match);

    return await MatchDto.fromEntity(savedMatch);
  }

  async update(id: string, matchData: UpdateMatchDto): Promise<UpdateResult> {
    const match = new Match();
    match.id = id;

    match.home_score = matchData.home_score;
    match.away_score = matchData.away_score;

    return this.matchesRepository.update(match.id, match);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.matchesRepository.delete(id);
  }
}
