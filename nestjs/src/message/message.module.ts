import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/Message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageGateway } from './events/message.gateway';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UserModule,
    ChatModule,
  ],
  providers: [MessageGateway, MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
