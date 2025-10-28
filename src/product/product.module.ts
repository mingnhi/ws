import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductResolver } from './product.resolver';
import { Category } from 'src/category/category.entity';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    UserModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver],
  exports: [TypeOrmModule.forFeature([Product]), ProductService],
})
export class ProductModule {}
