import {
  Controller,
  Get,
  UseGuards,
  SetMetadata,
  Param,
  Put,
  Body,
  Delete,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from './user.entity';
import { Response } from 'express';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata('roles', ['admin'])
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Put('user/:id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
    @Res() res: Response,
  ) {
    try {
      await this.userService.update(id, updateData);
      return res
        .status(200)
        .json({ message: 'Cập nhật người dùng thành công!' });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || 'Lỗi khi cập nhật người dùng.' });
    }
  }

  @Delete('user/:id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.userService.delete(id);
      return res.status(200).json({ message: 'Xóa người dùng thành công!' });
    } catch (error) {
      return res
        .status(400)
        .json({ message: error.message || 'Lỗi khi xóa người dùng.' });
    }
  }
}
