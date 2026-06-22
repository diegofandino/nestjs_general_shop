import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDTO {
    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}