import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartResolver } from './cart.resolver';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Product]), UserModule],
  controllers: [CartController],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
