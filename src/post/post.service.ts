import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto, user) {
    return this.postRepo.save({
      ...createPostDto,
      user,
    });
  }

  findAll() {
    return this.postRepo.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('Not found!');
    } else {
      return post;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const updating = await this.postRepo.findOneBy({ id });
    if (!updating) {
      throw new NotFoundException('Not found!');
    }
    await this.postRepo.update({ id }, updatePostDto);
    return this.postRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async remove(id: number) {
    const deleting = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!deleting) {
      throw new NotFoundException('Not found!');
    } else {
      await this.postRepo.delete({ id });
      return deleting;
    }
  }
}
