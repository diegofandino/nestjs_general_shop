import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

}
