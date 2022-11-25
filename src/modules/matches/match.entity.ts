import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../teams/team.entity'

@Entity()
export class Match {

    @PrimaryColumn()
    id: string

    @ManyToOne(() => Team)
    @JoinColumn()
    home_team: Team

    @Column()
    home_score: Number

    @ManyToOne(() => Team)
    @JoinColumn()
    away_team: Team

    @Column()
    away_score: Number

    @CreateDateColumn()
    createdAt: String
 
    @UpdateDateColumn()
    updtedAt: String
}
