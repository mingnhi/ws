import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  // Put,
  // Delete,
  UseGuards,
  SetMetadata,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Order } from './entities/order.entity';

@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @SetMetadata('roles', ['user', 'admin'])
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  @SetMetadata('roles', ['user'])
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }
  @SetMetadata('roles', ['admin'])
  @Get('/user/:userId')
  async findOrdersByUser(@Param('userId') userId: number): Promise<Order[]> {
    return this.orderService.findOrdersByUser(userId);
  }

  @SetMetadata('roles', ['user'])
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }
  @SetMetadata('roles', ['admin'])
  @Put(':id/status')
  async updateStatus(
    @Param('id') orderId: number,
    @Body('status') status: string,
    @Body('userId') userId: number,
    @Body('isAdmin') isAdmin: boolean,
  ): Promise<Order> {
    return this.orderService.updateStatus(+orderId, status, userId, isAdmin);
  }
  // @SetMetadata('roles', ['admin'])
  // @Put(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateOrderDto: UpdateOrderDto,
  // ) {
  //   return this.orderService.update(id, updateOrderDto);
  // }

  // @SetMetadata('roles', ['admin'])
  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.orderService.remove(id);
  // }
}
