import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('varchar', { length: 100 })
    name: string

    @Column('text', { nullable: true })
    description: string

    @Column('int', { default: 0 })
    stock: number

    @Column('numeric', { precision: 10, scale: 2 })
    price: number

    @Column('text', { unique: true })
    slug: string

    /*  @Column('text', { array: true })
     tags: string[] */

    @Column('text', { array: true })
    sizes: string[]

    @Column('text')
    gender: string

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
