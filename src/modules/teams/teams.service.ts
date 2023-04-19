import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTeamDto, TeamDto, UpdateTeamDto } from './dto';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>
  ) {}

  async findAll(): Promise<TeamDto[]> {
    return this.teamsRepository.find();
  }

  async findOneById(id: string): Promise<TeamDto> {
    return this.teamsRepository.findOneOrFail({ where: { id: id } });
  }

  async create(teamData: CreateTeamDto): Promise<TeamDto> {
    const team = new Team();
    team.id = uuidv4();
    team.name = teamData.name;

    const savedTeam = await this.teamsRepository.save(team);

    return <TeamDto>savedTeam;
  }

  async update(id: string, team: UpdateTeamDto): Promise<UpdateResult> {
    team.id = id;
    return this.teamsRepository.update(team.id, team);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.teamsRepository.delete(id);
  }
}
