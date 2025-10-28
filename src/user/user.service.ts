import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: {
    email: string;
    password: string;
    user_name: string;
    phone: string;
    address: string;
    role;
  }): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  findByEmail(email: string) {
    const user = this.userRepository.findOneBy({ email });
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    return user || null;
  }

  async updateProfile(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Cập nhật các thông tin người dùng từ dữ liệu được truyền vào
    Object.assign(user, updateData);

    // Lưu lại người dùng với thông tin đã cập nhật
    return this.userRepository.save(user);
  }

  async saveRefreshToken(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refresh_token = hashRefreshToken;
    return this.userRepository.save(user);
  }

  async verifyRefreshToken(refreshToken: string): Promise<User | null> {
    const users = await this.userRepository.find();
    for (const user of users) {
      if (user.refresh_token) {
        const isValid = await bcrypt.compare(refreshToken, user.refresh_token);
        if (isValid) {
          return user;
        }
      }
    }
    return null;
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }
}
