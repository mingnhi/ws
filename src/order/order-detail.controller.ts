import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  SetMetadata,
  //   Put,
  //   Delete,
} from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from './dto/create-orderdetail.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { OrderDetail } from './entities/orderdetail.entity';
// import { UpdateOrderDetailInput } from './dto/update-order-detail.input';

@Controller('order-detail')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @SetMetadata('roles', ['user', 'admin'])
  @Get()
  findAll() {
    return this.orderDetailService.findAll();
  }
  @SetMetadata('roles', ['user', 'admin'])
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderDetailService.findOne(id);
  }
  @SetMetadata('roles', ['user', 'admin'])
  @Post()
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailService.create(createOrderDetailDto);
  }

  @SetMetadata('roles', ['user', 'admin'])
  @Get('/order/:orderId')
  async findByOrderId(
    @Param('orderId') orderId: number,
  ): Promise<OrderDetail[]> {
    return this.orderDetailService.findByOrderId(+orderId);
  }
  // Cập nhật chi tiết đơn hàng
  //   @Put(':id')
  //   update(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Body() updateOrderDetailDto: UpdateOrderDetailInput,
  //   ) {
  //     return this.orderDetailService.update(id, updateOrderDetailDto);
  //   }

  //   // Xóa chi tiết đơn hàng theo id
  //   @Delete(':id')
  //   remove(@Param('id', ParseIntPipe) id: number) {
  //     return this.orderDetailService.remove(id);
  //   }
}
