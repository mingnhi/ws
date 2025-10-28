import {
  Controller,
  Get,
  Render,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetMetadata('roles', ['admin'])
export class AdminController {
  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  @Render('admin')
  async getAdminPage(@Req() req: any) {
    const products = await this.productService.getProducts();
    const orders = await this.orderService.findAll();
    const users = await this.userService.findAll();
    const categories = await this.categoryService.findAll();
    return {
      products,
      orders,
      users,
      categories,
      user: req.user,
      title: 'Quản trị',
    };
  }
}
