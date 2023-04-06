import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchDto {
  @ApiProperty({ type: Number })
  home_score: number;

  @ApiProperty({ type: Number })
  away_score: number;
}
