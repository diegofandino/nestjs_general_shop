import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('products')
export class Product {
    @ApiProperty({
        description: 'The id of the product',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        description: 'The name of the product',
        example: 'T-Shirt'
    })
    @Column('varchar', { length: 100 })
    name: string

    @ApiProperty({
        description: 'The description of the product',
        example: 'A comfortable and stylish t-shirt'
    })
    @Column('text', { nullable: true })
    description: string

    @ApiProperty({
        description: 'The stock of the product',
        example: 10
    })
    @Column('int', { default: 0 })
    stock: number

    @ApiProperty({
        description: 'The price of the product',
        example: 10
    })
    @Column('numeric', { precision: 10, scale: 2 })
    price: number

    @ApiProperty({
        description: "Slug of product",
        example: "t-shirt-slug"
    })
    @Column('text', { unique: true })
    slug: string

    @ApiProperty({
        description: "Tags of product",
        example: "[T-Shirt, Hoodie, Sweater]"
    })
    @Column('text', { array: true, default: [] })
    tags: string[]

    @ApiProperty({
        description: "Sizes of product",
        example: "[S, M, L, XL]"
    })
    @Column('text', { array: true })
    sizes: string[]

    @ApiProperty({
        description: "Gender of product",
        example: "Men"
    })
    @Column('text')
    gender: string

    @ApiProperty({
        description: "Images of product",
        example: "[https://example.com/img1, https://example.com/img2]"
    })
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    @ApiProperty()
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product
    )
    user: User

    /*   @Column('text')
      type: string */

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.name
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'", '');
        }
    }

    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
