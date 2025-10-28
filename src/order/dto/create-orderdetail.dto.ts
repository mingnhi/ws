import { InputType } from '@nestjs/graphql';
// import { OrderStatus } from '../entities/orderstatus.enum';
import { IsInt, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateOrderDetailDto {
  @IsInt()
  orderId: number;

  @IsInt()
  productId: number;

  @IsString()
  productName: string;

  @IsString()
  description: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  total_price: number;
}
