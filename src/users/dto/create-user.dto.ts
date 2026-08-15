import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'The full name of the user',
        example: 'John Doe',
        minLength: 3
    })
    @IsString()
    @MinLength(3)
    fullName: string;

    @ApiProperty({
        description: 'The unique email address of the user',
        example: 'john.doe@example.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password of the user (must contain at least one uppercase, lowercase letter, and a number)',
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
