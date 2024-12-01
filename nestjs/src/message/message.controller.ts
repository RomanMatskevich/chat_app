import { Controller, Post, Get, Param, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto'

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/send')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  createChat(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
  }

  @Get('get/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getByChatId(@Param('id') id: string){
    return this.messageService.getMessages(id)
  }


  
 
}