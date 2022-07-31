import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  findAll(user) {
    if (user.role === 'admin') {
      return this.postRepo.find({ relations: ['user'] });
    } else {
      return this.postRepo.findBy({ user: user });
    }
  }

  async findOne(id: number, user) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Not found!');
    } else if (post.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Forbidden!');
    } else {
      return post;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto, user) {
    const updating = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!updating) {
      throw new NotFoundException('Not found!');
    } else if (updating.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Forbidden!');
    } else {
      await this.postRepo.update({ id }, updatePostDto);
      return this.postRepo.findOne({ where: { id }, relations: ['user'] });
    }
  }

  async remove(id: number, user) {
    const deleting = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!deleting) {
      throw new NotFoundException('Not found!');
    } else if (deleting.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Forbidden!');
    } else {
      await this.postRepo.delete({ id });
      return deleting;
    }
  }
}
