import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Specie } from './specie.entity';
import { Pet } from './pet.entity';

@Entity({ name: 'breeds' })
export class Breed {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 45, unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Specie, (specie) => specie.breeds, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'specie_id' })
  specie: Specie;

  @OneToMany(() => Pet, (pet) => pet.breed)
  pets?: Pet[];
}
