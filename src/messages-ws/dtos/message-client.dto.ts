import { IsString, MinLength } from "class-validator";

export class MessageDTO {
    @IsString()
    @MinLength(1)
    message: string;
}