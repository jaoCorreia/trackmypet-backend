import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/database/entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateAddressDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const address = this.addressRepository.create({
    cep: dto.cep,
    country: dto.country,
    state: dto.state,
    city: dto.city,
    neighborhood:dto.neighborhood,
    street: dto.street,
    number:dto.number,  
    user
    });
    
    return await this.addressRepository.save(address);
  }

  async findAll(userId?: number) {
    const where: any = {};
    if (userId) where.user = { id: userId };

    return await this.addressRepository.find({
      where,
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(id: number, dto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');

    const {userId = null, ...rest} = dto;

    if (dto.userId) {
      const user = await this.userRepository.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
      address.user = user;
    }

    Object.assign(address,rest);
    
    return await this.addressRepository.save(address);
  }

  async delete(id: number) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    return await this.addressRepository.softDelete(id);
  }
}
