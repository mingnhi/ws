import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from 'src/category/category.entity';
import { Cart } from 'src/cart/cart.entity';
import { OrderDetail } from 'src/order/entities/orderdetail.entity';

@Entity('products')
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  image: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  create_at: Date;

  @Column()
  @Field(() => Int)
  categoryId: number;

  @OneToMany(() => Cart, (cart) => cart.product, { cascade: true })
  @Field(() => [Cart], { nullable: true })
  carts: Cart[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @Field(() => Category)
  category: Category;

  @OneToMany(() => OrderDetail, (orderdetail) => orderdetail.product, {
    cascade: true,
  })
  @Field(() => [OrderDetail], { nullable: true })
  orderdetail: OrderDetail[];
}
