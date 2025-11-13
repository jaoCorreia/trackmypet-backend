import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('email_verifications')
export class EmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  user_id: number;

  @Column()
  code_hash: string;

  @Column()
  expires_at: Date;

  @Column({ default: 0 })
  attempts: number;

  @CreateDateColumn()
  created_at: Date;
}
