import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  SetMetadata,
  UseGuards,
  Render,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CategoryService } from 'src/category/category.service';
import { Response } from 'express';
import { ValidationPipe } from '@nestjs/common';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) { }

  @Get('product/list')
  @Render('product')
  async getProductList(@Req() req: any) {
    const products = await this.productService.getProducts();
    return { products, title: 'Danh sách sản phẩm', user: req.user };
  }

  @Get('product/view/:id')
  @Render('product_detail')
  async getProductView(@Param('id') id: string, @Req() req: any) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { product, title: product.name, user: req.user };
  }

  @Get('product')
  async getAll(): Promise<Product[]> {
    return await this.productService.getProducts();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['user'])
  @Get('product/:id')
  async getDetail(@Param('id') id: number): Promise<Product> {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Post('admin/product')
  async create(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    input: CreateProductInput,
    @Res() res: Response,
  ) {
    try {
      const productInput = {
        ...input,
        image: input.image || '',
      };
      await this.productService.createProduct(productInput);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Thêm sản phẩm thành công!' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        error.message || 'Lỗi khi thêm sản phẩm.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Get('admin/product/:id/edit')
  @Render('edit_product')
  async getEditProductForm(@Param('id') id: number, @Req() req: any) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const categories = await this.categoryService.findAll();
    return {
      product,
      categories,
      user: req.user,
      title: `Chỉnh sửa sản phẩm #${id}`,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Put('admin/product/:id')
  async update(
    @Param('id') id: number,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    input: UpdateProductInput,
    @Res() res: Response,
  ) {
    try {
      const productInput = {
        ...input,
        image: input.image || '',
      };
      const updatedProduct = await this.productService.updateProduct(
        id,
        productInput,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Cập nhật sản phẩm thành công!' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        error.message || 'Lỗi khi cập nhật sản phẩm.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', ['admin'])
  @Delete('admin/product/:id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      const success = await this.productService.deleteProduct(id);
      if (!success) {
        throw new NotFoundException('Product not found');
      }
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Xóa sản phẩm thành công!' });
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi khi xóa sản phẩm.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get('search')
  @Render('partials/header')
  async searchProducts(@Query('q') query: string, @Res() res: Response) {
    if (!query || query.trim().length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Query string is required' });
    }

    try {
      // Gọi service để tìm kiếm sản phẩm
      const results = await this.productService.searchProducts(query);
      if (results.length > 0) {
        return res.status(HttpStatus.OK).json({ data: results });
      } else {
        return res
          .status(HttpStatus.OK)
          .json({ message: 'No products found matching your search.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        error: error.message,
      });
    }
  }
}