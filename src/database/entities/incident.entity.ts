import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from './pet.entity';

@Entity({ name: 'incidents' })
export class Incident {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', name:'phone_number', length: 15 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255})  
  description:string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Pet, (pet) => pet.incidents, { 
    nullable: false, 
    })
    
  @JoinColumn({ name: 'pet_id' })
    pet: Pet;
}