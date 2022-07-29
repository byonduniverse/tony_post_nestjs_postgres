import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}
  create(createPostDto: CreatePostDto) {
    return this.postRepo.save(createPostDto);
  }

  findAll() {
    return this.postRepo.find();
  }

  async findOne(id: number) {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not Found!',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      return post;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const updating = await this.postRepo.findOneBy({ id });
    if (!updating) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not Found!',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.postRepo.update({ id }, updatePostDto);
    return this.postRepo.findOneBy({ id });
  }

  async remove(id: number) {
    const deleting = await this.postRepo.findOneBy({ id });
    if (!deleting) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Not Found!',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      await this.postRepo.delete({ id });
      return deleting;
    }
  }
}
