import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDTO {
    @ApiProperty({
        description: 'The email address of the user',
        example: 'user@example.com'
    })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'Password123',
        minLength: 6,
        maxLength: 50
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}