import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/orderstatus.enum';

export class UpdateOrderDto {
  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  description?: string;
}
