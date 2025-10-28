import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async findAllCart(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'user'],
    });
  }

  async createCart(userId: number, input: CreateCartDto): Promise<Cart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const product = await this.productRepository.findOneBy({
      id: input.productId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!product) {
      throw new NotFoundException('product not found');
    }

    const cart = this.cartRepository.create({
      user,
      product,
      quantity: input.quantity,
      product_name: product.name,
      image: product.image,
      price: product.price,
    });
    return this.cartRepository.save(cart);
  }

  async update(input: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: input.id },
      relations: ['product'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    if (input.quantity !== undefined) {
      cart.quantity = input.quantity;
    }

    if (input.productId && input.productId !== cart.product.id) {
      const product = await this.productRepository.findOneBy({
        id: input.productId,
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      cart.product = product;
      cart.product_name = product.image;
      cart.image = product.image;
      cart.price = product.price;
    }
    return this.cartRepository.save(cart);
  }

  async remove(cartId: number, userId: number): Promise<boolean> {
    await this.cartRepository.delete({ id: cartId, user: { id: userId } });
    return true;
  }
}
