import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { TranslationsKeys } from 'src/common/translation-keys/translations-keys';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      return this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;

    const [products, total] = await this.productRepository.findAndCount({
      take: limit,
      skip: offset,
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
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(TranslationsKeys.CANNOT_FIND_PRODUCT(id));
    }

    try {
      return this.productRepository.save(product);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(term: string) {
    const product = await this.findOne(term);
    return await this.productRepository.remove(product);
  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new InternalServerErrorException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(TranslationsKeys.CANNOT_CREATE_PRODUCT);
  }
}
