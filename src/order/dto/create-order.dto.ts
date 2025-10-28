import { Field, Int, InputType } from '@nestjs/graphql';
import { OrderStatus } from '../entities/orderstatus.enum';
import { CreateOrderDetailDto } from './create-orderdetail.dto';

@InputType()
export class CreateOrderDto {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  quantity: number;

  @Field()
  username: string;

  @Field()
  user_phone: string;

  @Field()
  address_user: string;

  @Field(() => OrderStatus, { defaultValue: OrderStatus.PENDING })
  status: OrderStatus;

  @Field(() => [CreateOrderDetailDto])
  details: CreateOrderDetailDto[];
}
