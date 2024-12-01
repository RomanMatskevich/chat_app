import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    chatId: string; 
  
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    senderId: string; 
  
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    text: string; 
}