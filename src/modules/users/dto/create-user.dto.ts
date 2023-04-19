import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.role';

export class CreateUserDto {
  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ enum: ['Admin', 'Moderator', 'User'] })
  role: UserRole;
}
