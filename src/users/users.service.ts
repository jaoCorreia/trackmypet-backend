import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserEntity } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "./dto";

@Injectable()
export class UsersService{

    constructor (
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<User>
    ){}

    async create(dto:CreateUserDto){
        const user = this.userRepository.create(dto);
        return await this.userRepository.save(user);
    }

    async findAll(){
        return await this.userRepository.find();
    }

    async findOne(id: number){
        const user = await this.userRepository.findOne({where: {id}});
        if (!user) throw new NotFoundException("User not found");
        return user;
    }

    async update(id: number, dto:UpdateUserDto){
        const user = await this.userRepository.findOne({where: {id}});
        if (!user) throw new NotFoundException("User not found");
        Object.assign(user, dto);
        return await this.userRepository.save(user);
    }

    async delete(id: number){
        const user = await this.userRepository.findOne({where: {id}});
        if (!user) throw new NotFoundException("User not found");
        return await this.userRepository.softDelete(user);
    }
}