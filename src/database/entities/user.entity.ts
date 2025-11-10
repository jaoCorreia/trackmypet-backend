import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { RefreshToken } from './refresh_token.entity';
import { Pet } from './pet.entity';
import { Address } from './address.entity';
import { Activity } from './activity.entity';
import { UserGender } from './user-gender.enum';
import { FileCategory } from './file-category.entity';
import { Notification } from './notification.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 45, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo?: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserGender })
  gender: UserGender;

  @Column({ type: 'varchar', length: 16, unique: true })
  cpf: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'phone_number', type: 'varchar', length: 25, unique: true })
  phoneNumber: string;

  @Column({
    name: 'device_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  deviceToken?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {})
  refreshTokens?: RefreshToken[];

  @OneToMany(() => Pet, (pet) => pet.user)
  pets?: Pet[];

  @OneToMany(() => Address, (address) => address.user, { eager: true })
  addresses?: Address[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities?: Activity[];

  @OneToMany(() => FileCategory, (file_category) => file_category.user)
  file_categories?: FileCategory[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications?: Notification[];
}
