import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, Length, IsInt, Min, IsArray } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field({ nullable: false })
  @IsString()
  @Length(3, 100)
  name: string;

  @Field(() => Int, { nullable: false })
  @IsInt()
  @Min(1)
  price: number;

  @Field(() => Int, { nullable: false })
  @IsInt()
  @Min(1)
  quantity: number;

  @Field({ nullable: false })
  @IsString()
  description: string;

  @Field(() => Int, { nullable: false })
  @IsInt()
  categoryId: number;

  @Field({ nullable: false })
  @IsString()
  image: string;
}
