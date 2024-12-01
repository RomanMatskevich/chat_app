import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from "./user/user.module";
import { MessageModule } from "./message/message.module";
@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env.development', isGlobal: true}),
        MongooseModule.forRoot(process.env.MONGODB_STRING), 
        UserModule,
        ChatModule,
        MessageModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}