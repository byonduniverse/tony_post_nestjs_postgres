import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { PostService } from './post.service';
import { Post as PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<PostEntity> {
    return this.postService.create(createPostDto, req.user);
  }

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<HttpException | PostEntity> {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity | HttpException> {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<HttpException | PostEntity> {
    return this.postService.remove(+id);
  }
}
