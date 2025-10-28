import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
//
import { Cart } from 'src/cart/cart.entity';
import { Order } from 'src/order/entities/order.entity';
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ nullable: false })
  @Field()
  user_name: string;

  @Column({ unique: true, nullable: false })
  @Field()
  email: string;

  @Column({ nullable: false })
  @HideField()
  password: string;

  @Column()
  @Field()
  address: string;

  @Column({ nullable: true })
  @HideField()
  refresh_token?: string;

  @Column()
  @Field()
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @Field()
  role: UserRole;

  @OneToMany(() => Cart, (cart) => cart.user)
  @Field(() => [Cart], { nullable: true })
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  @Field(() => [Order], { nullable: true })
  orders: Order[];
}
