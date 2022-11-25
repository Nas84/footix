import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, OneToMany } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Team {

   @PrimaryColumn()
   id: string

   @Column({ length: 50 })
   @ApiProperty({ type: [String] })
   name: string

   // @Column()
   // @ApiProperty({ type: [Blob] })
   // crest: Blob

   @CreateDateColumn()
   createdAt: String

   @UpdateDateColumn()
   updtedAt: String
   
}