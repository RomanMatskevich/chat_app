import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/Chat.schema';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema}]), UserModule],
    providers: [ChatService],
    controllers: [ChatController],
    exports: [ChatService]
})
export class ChatModule {}
