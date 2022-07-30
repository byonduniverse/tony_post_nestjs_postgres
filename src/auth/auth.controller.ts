import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/authCredentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: AuthCredentials) {
    return this.authService.login(credentials);
  }

  @Post('register')
  async register(@Body() credentials: AuthCredentials, @Res() res: Response) {
    const user = await this.authService.register(credentials);
    return res.status(HttpStatus.CREATED).json(user);
  }
}
