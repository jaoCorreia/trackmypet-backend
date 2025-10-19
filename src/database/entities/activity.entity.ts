import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import { User } from "./user.entity";
import { ActivitySchedule } from "./activity-schedules.entity";

@Entity({name: 'activities'})
export class Activity {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id:number;

    @Column({ type: 'varchar', length: 150})
    name: string;

    @Column({ type: 'varchar', length: 255})
    icon: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => User, (user) => user.activities, { 
            nullable: false, 
        })
        
    @JoinColumn({ name: 'user_id' })
        user: User;
        
    @OneToMany(() => ActivitySchedule, (activitySchedule) => activitySchedule.activity)
        activity_schedules?: ActivitySchedule[];
}