import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/user.entity';
import { OrderDetail } from './orderdetail.entity';

@ObjectType()
@Entity()
export class Order {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Field(() => [OrderDetail])
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  orderDetails: OrderDetail[];


  @Field(() => Int)
  @Column()
  quantity: number;

  @Field()
  @Column()
  status: string;

  @Field()
  @Column()
  user_name: string;

  @Field()
  @Column()
  user_phone: string;

  @Field()
  @Column()
  address_user: string;
}
