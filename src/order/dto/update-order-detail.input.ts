import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateOrderDetailInput {
  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  total_price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
