import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { UserRole } from './user.role';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 64 })
  password: string;

  @Column()
  role: UserRole;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
