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
import { PetSex } from './pet-sex.enum';
import { PetAge } from './pet-age.enum';
import { User } from './user.entity';
import { Breed } from './breed.entity';
import { ActivitySchedule } from './activity-schedule.entity';
import { Incident } from './incident.entity';
import { File } from './file.entity';

@Entity({ name: 'pets' })
export class Pet {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: PetSex })
  sex: PetSex;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: PetAge })
  age: PetAge;

  @Column({ type: 'mediumtext', nullable: true })
  bio?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.pets, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Breed, (breed) => breed.pets, {
    nullable: true,
  })
  @JoinColumn({ name: 'breed_id' })
  breed?: Breed;

  @OneToMany(() => ActivitySchedule, (activitySchedule) => activitySchedule.pet)
  activity_schedules?: ActivitySchedule[];

  @OneToMany(() => Incident, (incident) => incident.pet)
    incidents?: Incident[];

  @OneToMany(() => File, (file) => file.pet)
    files?: File[];
}
