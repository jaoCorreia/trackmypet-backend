import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ ...rest, passwordHash });
    return await this.userRepository.save(user);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto) {
    const { password = null, ...rest } = dto;

    const user = await this.userRepository.preload({
      id: id,
      ...rest,
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    return await this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return await this.userRepository.softDelete(id);
  }
}
