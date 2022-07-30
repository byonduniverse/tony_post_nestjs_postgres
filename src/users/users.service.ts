import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const old = await this.findOneByUsername(createUserDto.username);
    if (old) {
      throw new BadRequestException('User with that username already exist!');
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);

    return this.userRepo.save({
      username: createUserDto.username,
      password: hash,
    });
  }

  findAll() {
    return this.userRepo.find({
      where: { role: 'user' },
      relations: ['posts'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException('Not found!');
    }
    return user;
  }

  findOneByUsername(username: string) {
    return this.userRepo.findOne({ where: { username }, relations: ['posts'] });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updating = await this.userRepo.findOneBy({ id });

    if (!updating) {
      throw new NotFoundException('Not found!');
    }

    const old = await this.userRepo.findOne({
      where: { id: Not(id), username: updateUserDto.username },
    });

    if (old) {
      throw new BadRequestException('User with that username already exist!');
    }

    updating.username = updateUserDto.username;
    updating.password = await bcrypt.hash(updateUserDto.password, 10);

    await this.userRepo.update({ id }, updating);
    return this.userRepo.findOne({ where: { id }, relations: ['posts'] });
  }

  async remove(id: number) {
    const deleting = await this.userRepo.findOne({
      where: { id },
      relations: ['posts'],
    });

    if (!deleting) {
      throw new NotFoundException('Not found!');
    } else {
      await this.userRepo.delete({ id });
      return deleting;
    }
  }
}
