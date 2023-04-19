import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  password: string;
}
