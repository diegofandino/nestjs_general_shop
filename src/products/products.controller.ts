import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { IsValidUuidPipe } from 'src/common/pipes/is-valid-uuid/is-valid-uuid.pipe';
/* import { IsValidUuidPipe } from 'src/common/pipes/is-valid-uuid/is-valid-uuid.pipe';
 */ import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @Auth(ValidRoles.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    type: Product
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product data'
  })

  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(
    @Query() paginationDTO: PaginationDTO
  ) {
    return this.productsService.findAll(paginationDTO);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  update(
    @Param('id', IsValidUuidPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
