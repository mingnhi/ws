import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductModule } from './product/product.module';
import { OderModule } from './order/oder.module';
import { CartModule } from './cart/cart.module';

import { CategoryModule } from './category/category.module';
import { Cart } from './cart/cart.entity';
import { Product } from './product/product.entity';
import { Category } from './category/category.entity';
import { AuthModule } from './auth/auth.module';

import { Order } from './order/entities/order.entity';
import { OrderDetail } from './order/entities/orderdetail.entity';

import { HomeModule } from './home/home.module';
import { MailModule } from './mail/mail.module';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'mingnhee',
      password: '12070123Aa@',
      database: 'nestproject',
      entities: [User, Product, Category, Cart, Order, OrderDetail],
      synchronize: true,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    ProductModule,
    AuthModule,
    CartModule,
    OderModule,
    CategoryModule,
    HomeModule,
    UserModule,
    MailModule,
  ],
  controllers: [AppController, AdminController],
  providers: [AppService],
})
export class AppModule {}
