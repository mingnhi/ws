import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { SetMetadata } from '@nestjs/common';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product], { name: 'getProducts' })
  async getProducts(): Promise<Product[]> {
    return this.productService.getProducts();
  }

  @Query(() => Product, { name: 'getProduct' })
  async getProduct(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Mutation(() => Product, { name: 'createProduct' })
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productService.createProduct(createProductInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Mutation(() => Product, { name: 'updateProduct' })
  async updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.updateProduct(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Mutation(() => Boolean, { name: 'deleteProduct' })
  async deleteProduct(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.productService.deleteProduct(id);
    return true;
  }
}
