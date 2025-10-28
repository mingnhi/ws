import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';

@Injectable()
export class HomeService {
  constructor(private readonly productService: ProductService) {
    console.log('HomeService initialized');
  }

  async getHomePageData() {
    try {
      console.log('Fetching products...');
      const products = await this.productService.getProducts();

      // Lọc sản phẩm dựa trên categoryId
      const sandalsWomen = products.filter(
        (product) => product.category?.id === 1,
      ); // Giày nữ
      const sandalsMen = products.filter(
        (product) => product.category?.id === 2,
      ); // Giày nam

      // Debug log để kiểm tra kết quả lọc
      console.log('Sandals Women:', sandalsWomen);
      console.log('Sandals Men:', sandalsMen);

      return {
        sandalsWomen,
        sandalsMen,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        sandalsWomen: [],
        sandalsMen: [],
      };
    }
  }
}
