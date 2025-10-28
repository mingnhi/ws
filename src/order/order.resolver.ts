import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderDto') createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Query(() => [Order])
  findAllOrders() {
    return this.orderService.findAll();
  }

  @Query(() => Order)
  findOneOrder(@Args('id', { type: () => Int }) id: number) {
    return this.orderService.findOne(id);
  }
}
