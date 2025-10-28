import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Order } from './order.entity';
import { Product } from 'src/product/product.entity';

@ObjectType()
@Entity()
export class OrderDetail {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  productName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => Int)
  @Column()
  total_price: number;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.orderDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;


  @ManyToOne(() => Product, (product) => product.orderdetail)
  @Field(() => Product)
  product: Product;
}
