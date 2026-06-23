import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ) { }

  async executeSeed() {
    await this.productsService.removeAllProducts();

    const data = initialData.products;

    const productPromises: Promise<Product>[] = [];

    data.forEach(product => {
      const { title, ...productDetails } = product;
      productPromises.push(
        this.productsService.create({
          ...productDetails,
          name: title,
        })
      );
    });

    await Promise.all(productPromises);

    return 'Seed executed';
  }
}
