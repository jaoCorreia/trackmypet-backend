import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Breed } from './breed.entity';

@Entity({name: 'species'})
export class Specie {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id:number;

    @Column({ type: 'varchar', length: 45, unique: true})
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    icon?: string;    

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @OneToMany(() => Breed, (breed) => breed.specie)
    breeds?: Breed[];
}
