import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carts')
@ObjectType()
export class Cart {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  quantity: number;

  @Column()
  @Field()
  image: string;

  @Column()
  @Field()
  product_name: string;

  @Column()
  @Field(() => Int)
  price: number;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Product, (product) => product.carts, { onDelete: 'CASCADE' })
  @Field(() => Product)
  product: Product;
}
