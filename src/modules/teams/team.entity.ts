import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../matches/match.entity';

@Entity()
export class Team {
  @PrimaryColumn()
  id: string;

  @Column({ length: 50 })
  @ApiProperty({ type: [String] })
  name: string;

  // @Column()
  // @ApiProperty({ type: [Blob] })
  // crest: Blob

  @OneToMany(() => Match, (match) => match.home_team)
  home_matches: Match[];

  @OneToMany(() => Match, (match) => match.away_team)
  away_matches: Match[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
