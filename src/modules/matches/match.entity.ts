import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from '../teams/team.entity';

@Entity()
export class Match {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Team)
  @JoinColumn()
  home_team: Team;

  @Column()
  home_score: number;

  @ManyToOne(() => Team)
  @JoinColumn()
  away_team: Team;

  @Column()
  away_score: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
