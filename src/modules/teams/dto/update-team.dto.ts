import { ApiProperty } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';

export class UpdateTeamDto extends CreateTeamDto {
  @ApiProperty({ type: String })
  id: string;
}
