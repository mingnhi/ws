import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Delete,
  Put,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  SetMetadata,
  Render,
  Res,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata('roles', ['user'])
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Render('cart')
  async getCartPage(@Request() req, @Res() res: Response) {
    try {
      const cart = await this.cartService.findAllCart(req.user.userId);
      return { cart, title: 'Giỏ hàng', user: req.user };
    } catch (error) {
      if (error.status === 401) {
        res.cookie('error', 'Vui lòng đăng nhập để xem giỏ hàng.', {
          httpOnly: false,
          maxAge: 5000,
        });
        return res.redirect('/auth/login');
      }
      throw error;
    }
  }

  @Post()
  async create(
    @Request() req,
    @Body() input: CreateCartDto,
    @Res() res: Response,
  ) {
    try {
      await this.cartService.createCart(req.user.userId, input);
      res.cookie('message', 'Thêm sản phẩm vào giỏ hàng thành công!', {
        httpOnly: false,
        maxAge: 5000,
      });
      return res.redirect(`/product/${input.productId}`);
    } catch (error) {
      res.cookie(
        'error',
        error.message || 'Không thể thêm sản phẩm vào giỏ hàng.',
        {
          httpOnly: false,
          maxAge: 5000,
        },
      );
      return res.redirect(`/product/${input.productId}`);
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: Partial<UpdateCartDto>,
  ) {
    return this.cartService.update({ id, ...input });
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ message: string }> {
    const result = await this.cartService.remove(id, req.user.userId);
    if (!result) {
      throw new NotFoundException('Cart item not found');
    }
    return { message: 'Cart item removed successfully' };
  }
}
