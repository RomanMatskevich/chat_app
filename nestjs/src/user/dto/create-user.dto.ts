import { IsString, IsNotEmpty, MinLength } from "class-validator";


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    lastName: string;
}
