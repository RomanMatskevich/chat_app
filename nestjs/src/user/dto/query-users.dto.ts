import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class QueryUsersDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}
