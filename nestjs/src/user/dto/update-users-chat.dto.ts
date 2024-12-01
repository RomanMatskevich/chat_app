import { IsNotEmpty, IsString } from 'class-validator';
export class UpdateUsersChatsDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  participants: string[];
}
