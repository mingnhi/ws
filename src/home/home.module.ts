import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module'; // Nhập CategoryModule

@Module({
  imports: [ProductModule, UserModule, CategoryModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
