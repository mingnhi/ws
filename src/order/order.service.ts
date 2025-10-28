import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../user/user.entity';
import { OrderDetail } from './entities/orderdetail.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepository.findOne({
      where: { id: createOrderDto.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const order = this.orderRepository.create({
      user,
      quantity: createOrderDto.quantity,
      status: createOrderDto.status,
      user_name: createOrderDto.username,
      user_phone: createOrderDto.user_phone,
      address_user: createOrderDto.address_user,
    });

    return this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'detail', 'detail.product'],
    });
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['detail', 'detail.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'detail', 'detail.product'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async updateStatus(
    orderId: number,
    status: string,
    userId: number,
    isAdmin: boolean,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (!isAdmin && order.user.id !== userId) {
      throw new Error('You do not have permission to update this order');
    }

    order.status = status;
    return this.orderRepository.save(order);
  }
}
