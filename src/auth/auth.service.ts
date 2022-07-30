import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthCredentials } from './dto/authCredentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(credentials: AuthCredentials) {
    const user = (await this.usersService.create(credentials)) as User;

    const token = await this.jwtService.sign({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }

  async login(credentials: AuthCredentials) {
    const { username, password } = credentials;
    const oldUser = await this.usersService.findOneByUsername(username);

    if (!oldUser) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const match = await bcrypt.compare(password, oldUser.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    const user = {
      id: oldUser.id,
      username: oldUser.username,
      role: oldUser.role,
      status: oldUser.status,
    };
    const token = await this.jwtService.sign(user);

    return {
      user,
      token,
    };
  }
}
