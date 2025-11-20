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
import { Activity } from './activity.entity';
import { Pet } from './pet.entity';
import { ActivityHistory } from './activity-history.entity';

@Entity({ name: 'activity_schedules' })
export class ActivitySchedule {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    name: 'week_days',
    type: 'longtext',
    nullable: true,
    transformer: {
      to: (value: number[] | null | undefined): string | null => {
        if (!value || !Array.isArray(value)) return null;
        return JSON.stringify(value);
      },
      from: (value: string | null | undefined): number[] => {
        if (!value || typeof value !== 'string') return [];
        try {
          const parsed: unknown = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.map((v) => Number(v));
          }
          return [];
        } catch {
          return [];
        }
      },
    },
  })
  weekDays: number[];

  @Column({ type: 'datetime' })
  time: Date;

  @Column({ name: 'is_recurring', type: 'tinyint', width: 1, default: 0 })
  isRecurring: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Activity, (activity) => activity.activity_schedules, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @ManyToOne(() => Pet, (pet) => pet.activity_schedules, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pet_id' })
  pet?: Pet;

  @OneToMany(
    () => ActivityHistory,
    (activityHistory) => activityHistory.activitySchedule,
  )
  activity_history?: ActivityHistory[];
}
