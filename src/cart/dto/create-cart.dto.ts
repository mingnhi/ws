import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCartDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field()
  product_name: string;

  @Field(() => Int, { nullable: false })
  price: number;

  @Field()
  image: string;
}
