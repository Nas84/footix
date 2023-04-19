import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../team.entity';

export class TeamDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  createdAt: string;

  @ApiProperty({ type: String })
  updatedAt: string;

  public static async fromEntity(teamEntity: Team): Promise<TeamDto> {
    const teamDto = new TeamDto();
    teamDto.id = teamEntity.id;
    teamDto.name = teamEntity.name;
    teamDto.createdAt = teamEntity.createdAt;
    teamDto.updatedAt = teamEntity.updatedAt;
    return teamDto;
  }
}
