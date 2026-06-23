import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { TranslationsKeys } from 'src/common/translation-keys/translations-keys';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const { images = [], ...productDetails } = createProductDto;

    try {
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;

    const [products, total] = await this.productRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return {
      data: products,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + products.length < total,
        nextOffset: offset + products.length < total ? offset + limit : null,
      }
    };
  }

  async findOne(term: string) {
    let product: Product | null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productRepository.createQueryBuilder('product')
        .leftJoinAndSelect('product.images', 'images')
        .where('LOWER(slug) = :slug or LOWER(name) = :name', {
          slug: term.toLowerCase(),
          name: term.toLowerCase()
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(TranslationsKeys.CANNOT_FIND_PRODUCT(term));
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...productDetails } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...productDetails,
    });

    if (!product) {
      throw new NotFoundException(TranslationsKeys.CANNOT_FIND_PRODUCT(id));
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (images) {
      await queryRunner.manager.delete(ProductImage, { product: { id } });
      product.images = images.map(image => this.productImageRepository.create({ url: image }));
    } else {
      product.images = await this.productImageRepository.find({ where: { product: { id } } });
    }

    await queryRunner.manager.save(product);

    try {
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(term: string) {
    const product = await this.findOne(term);
    return await this.productRepository.remove(product);
  }

  async removeAllProducts() {
    const query = await this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  private handleDBExceptions(error: any): never {
    if (error.code === '23505') {
      throw new InternalServerErrorException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(TranslationsKeys.CANNOT_CREATE_PRODUCT);
  }
}
