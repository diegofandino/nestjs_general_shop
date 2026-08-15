import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDTO {

    @ApiProperty({
        default: 10,
        description: "Number of items per page",
        example: 10
    })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        default: 0,
        description: "Number of items to skip",
        example: 0
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}