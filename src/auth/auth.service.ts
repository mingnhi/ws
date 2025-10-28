import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const { email, password, user_name, phone, address, role } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.create({
      email,
      password: hashedPassword,
      user_name,
      phone: phone as string,
      address: address as string,
      role, // Lưu role từ DTO
    });
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string; refresh_token: string }> {
    const user = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const payload = { email: user.email, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.userService.saveRefreshToken(refreshToken, user.id);
    return {
      user,
      accessToken: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async verifyRefreshToken(refreshToken: string): Promise<User> {
    const user = await this.userService.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return user;
  }
}
