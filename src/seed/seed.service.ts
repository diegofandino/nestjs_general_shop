import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: AuthService
  ) { }

  async removeTables() {
    await this.productsService.removeAllProducts();
    await this.usersService.removeUsers();
    const user = await this.usersService.addDummyUsers(initialData);
    this.executeSeed(user);
  }

  async executeSeedWithUser() {
    await this.removeTables();
  }

  async executeSeed(user: User) {

    const data = initialData.products;

    const productPromises: Promise<Product>[] = [];

    data.forEach(product => {
      const { title, ...productDetails } = product;
      productPromises.push(
        this.productsService.create({
          ...productDetails,
          name: title,
        }, user)
      );
    });

    await Promise.all(productPromises);

    return 'Seed executed';
  }
}
