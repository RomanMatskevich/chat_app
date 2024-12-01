import { IsString, IsNotEmpty, MinLength } from "class-validator";


export class AddUserToChatDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    chatId: string;
}
