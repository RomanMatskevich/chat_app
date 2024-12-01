import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class GetMessagesByChatIdDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    chatId: string; 
}