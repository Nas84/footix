import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({ type: String })
  home_team: string;

  @ApiProperty({ type: String })
  away_team: string;
}
