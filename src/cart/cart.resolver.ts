import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Resolver(() => Cart)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => [Cart])
  @SetMetadata('roles', ['user', 'admin'])
  async getAllCarts(@Context() context): Promise<Cart[]> {
    const userId = context.req.user.userId;
    return this.cartService.findAllCart(userId);
  }

  @Mutation(() => Cart)
  @SetMetadata('roles', ['user', 'admin'])
  async createCart(
    @Args('input') input: CreateCartDto,
    @Context() context: any,
  ) {
    const userId = context.req.user.userId;
    return this.cartService.createCart(userId, input);
  }

  @Mutation(() => Cart)
  @SetMetadata('roles', ['user', 'admin'])
  async updateCart(@Args('input') input: CreateCartDto) {
    return this.cartService.update(input);
  }

  @Mutation(() => Boolean)
  @SetMetadata('roles', ['user', 'admin'])
  async removeCart(
    @Args('cartId', { type: () => Int }) cartId: number,
    @Context() context: any,
  ) {
    const userId = context.req.user.userId;
    return this.cartService.remove(cartId, userId);
  }
}
