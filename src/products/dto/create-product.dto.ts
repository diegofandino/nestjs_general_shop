import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        default: 'Product name',
        description: 'Product name',
        example: 'Product name'
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        default: 0,
        description: 'Product price',
        example: 0
    })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({
        default: 'Product description',
        description: 'Product description',
        example: 'Product description'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        default: 'product-slug',
        description: 'Product slug',
        example: 'product-slug'
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        default: 0,
        description: 'Product stock',
        example: 0
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        default: ['S', 'M', 'L', 'XL'],
        description: 'Product sizes',
        example: ['S', 'M', 'L', 'XL']
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        default: 'unisex',
        description: 'Product gender suitability',
        enum: ['men', 'women', 'kid', 'unisex'],
        example: 'unisex'
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        default: 'Product type',
        description: 'Product type',
        example: 'Product type'
    })
    @IsString()
    @IsOptional()
    type?: string;

    @ApiProperty({
        default: ['tag1', 'tag2', 'tag3'],
        description: 'Product tags',
        example: ['tag1', 'tag2', 'tag3']
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        default: ['image1', 'image2', 'image3'],
        description: 'Product images',
        example: ['image1', 'image2', 'image3']
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];
}
