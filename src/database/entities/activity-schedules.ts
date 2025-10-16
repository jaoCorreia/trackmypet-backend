import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import { Activity } from "./activity.entity";
import { Pet } from "./pet.entity";

@Entity({name: 'activity_schedules'})
export class ActivitySchedule {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id:number;

    @Column({ name: 'week_day', type: 'tinyint', width: 1 })
    weekDay: number;

    @Column({ type: 'datetime' })
    time: Date;

    @Column({ name: 'is_recurring', type: 'tinyint', width:1, default:0})
    isRecurring: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => Activity, (activity) => activity.activity_schedules, { 
            nullable: false, 
            onDelete: "CASCADE"
        })
        
    @JoinColumn({ name: 'activity_id' })
        activity: Activity;

    @ManyToOne(() => Pet, (pet) => pet.activity_schedules, { 
        nullable: false, 
        onDelete: "CASCADE"
        })
        
    @JoinColumn({ name: 'pet_id' })
        pet: Pet;
}