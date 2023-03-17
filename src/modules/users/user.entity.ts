import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user.role';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ length: 50 })
  @ApiProperty({ type: [String] })
  username: string;

  @Column({ length: 64 })
  @ApiProperty({ type: [String] })
  password: string;

  @Column()
  @ApiProperty({ enum: ['Admin', 'Moderator', 'User'] })
  role: UserRole;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
