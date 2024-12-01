import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/create')
  createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }
  @Get('query')
  getChats(@Query() query: {ids: string}) {
    return this.chatService.getChatsByIds(query.ids)
  }
}