import { UserRole } from '../user.role';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ enum: ['Admin', 'Moderator', 'User'] })
  role: UserRole;

  @ApiProperty({ type: String })
  createdAt: string;

  @ApiProperty({ type: String })
  updatedAt: string;
}
