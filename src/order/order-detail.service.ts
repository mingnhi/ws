import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/orderdetail.entity';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from './dto/create-orderdetail.dto';
import { Product } from '../product/product.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createDto: CreateOrderDetailDto): Promise<OrderDetail> {
    const product = await this.productRepository.findOne({
      where: { id: createDto.productId },
    });
    const order = await this.orderRepository.findOne({
      where: { id: createDto.orderId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createDto.productId} not found`,
      );
    }

    if (!order) {
      throw new NotFoundException(
        `Order with ID ${createDto.orderId} not found`,
      );
    }

    const detail = this.orderDetailRepository.create({
      order: { id: order.id },
      product: { id: product.id },
      productName: createDto.productName,
      description: createDto.description,
      quantity: createDto.quantity,
      total_price: createDto.total_price,
    });

    return this.orderDetailRepository.save(detail);
  }

  async findAll(): Promise<OrderDetail[]> {
    return this.orderDetailRepository.find({
      relations: ['product', 'order'],
    });
  }

  async findByOrderId(orderId: number): Promise<OrderDetail[]> {
    return this.orderDetailRepository.find({
      where: { order: { id: orderId } },
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<OrderDetail> {
    const detail = await this.orderDetailRepository.findOne({
      where: { id },
      relations: ['product', 'order'],
    });

    if (!detail) {
      throw new NotFoundException(`OrderDetail with ID ${id} not found`);
    }

    return detail;
  }

  // async updateDetailStatus(
  //   detailId: number,
  //   status: string,
  //   userId: number,
  //   isAdmin: boolean,
  // ): Promise<OrderDetail> {
  //   const detail = await this.orderDetailRepository.findOne({
  //     where: { id: detailId },
  //     relations: ['order', 'order.user'],
  //   });

  //   if (!detail) {
  //     throw new NotFoundException('Order Detail not found');
  //   }

  //   if (!isAdmin && detail.order.user.id !== userId) {
  //     throw new Error('You do not have permission to update this order detail');
  //   }

  //   detail.status = status;
  //   return this.orderDetailRepository.save(detail);
  // }
}
