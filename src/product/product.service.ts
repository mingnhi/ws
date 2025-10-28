import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Category } from 'src/category/category.entity';
// import * as removeAccents from 'remove-accents';
import { Like } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async getProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category'],
    });
  }

  async getProductById(id: number | string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: Number(id) },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: input.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const newProduct = this.productRepository.create({
      ...input,
      category: category,
    });
    return this.productRepository.save(newProduct);
  }

  async updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
    const product = await this.getProductById(id);
    const category = await this.categoryRepository.findOne({
      where: { id: input.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    Object.assign(product, {
      ...input,
      category: category,
    });
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const product = await this.getProductById(id);
    await this.productRepository.remove(product);
    return true;
  }
  async searchProducts(query: string): Promise<Product[]> {
    const searchQuery = `%${query.toLowerCase()}%`;

    // Sử dụng QueryBuilder để tìm kiếm sản phẩm
    return this.productRepository
      .createQueryBuilder('product')
      .where('LOWER(product.name) LIKE :query', { query: searchQuery })
      .orWhere('LOWER(product.description) LIKE :query', { query: searchQuery })
      .getMany();
  }
}
