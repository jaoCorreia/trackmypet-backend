import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import { FileCategory } from "./file-category.entity";
import { Pet } from "./pet.entity";

@Entity({name: 'files'})
export class File {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id:number;

    @Column({ name: 'file_url', type: 'varchar', length: 255})
    fileUrl: string;

    @Column({ type: 'varchar', length: 45})
    name: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt?: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => FileCategory, (fileCategory) => fileCategory.files, { 
        nullable: false, 
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: 'file_category_id' })
    fileCategory: FileCategory;
   

    @ManyToOne(() => Pet, (pet) => pet.files, { 
            nullable: false, 
            onDelete: "CASCADE"
        })
        
    @JoinColumn({ name: 'pet_id' })
        pet: Pet;        
    }
