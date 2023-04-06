import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../match.entity';
import { TeamDto } from '../../teams/dto';

export class MatchDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: TeamDto })
  home_team: TeamDto;

  @ApiProperty({ type: Number })
  home_score: number;

  @ApiProperty({ type: TeamDto })
  away_team: TeamDto;

  @ApiProperty({ type: Number })
  away_score: number;

  @ApiProperty({ type: String })
  createdAt: string;

  @ApiProperty({ type: String })
  updatedAt: string;

  public static async fromEntity(matchEntity: Match): Promise<MatchDto> {
    const matchDto = {
      ...matchEntity,
      home_team: await TeamDto.fromEntity(matchEntity.home_team),
      away_team: await TeamDto.fromEntity(matchEntity.away_team)
    };

    return matchDto;
  }
}
