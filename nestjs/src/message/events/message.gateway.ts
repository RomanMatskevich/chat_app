import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
import { MessageService } from '../message.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { ChatService } from 'src/chat/chat.service';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@WebSocketGateway(3002, { cors: { origin: '*' }})
export class MessageGateway {
    constructor(
      private readonly messageService: MessageService,
      private readonly chatService: ChatService
    ) {}

    @WebSocketServer() server: Server
    private clients = new Map<string, Socket>();
    private rateLimiter = new RateLimiterMemory({
      points: 1, 
      duration: 1, 
    });

    handleConnection(client: Socket) {
      const userId = client.handshake.query.userId as string;
      this.clients.set(userId, client); 
      console.log(`Client connected: ${userId}`);
    }
  
    handleDisconnect(client: Socket) {
      const userId = [...this.clients.entries()]
        .find(([_, socket]) => socket === client)?.[0];
      this.clients.delete(userId);
      console.log(`Client disconnected: ${userId}`);
    }
  
    sendMessageToClient(userId: string, messageData: any) {
      const client = this.clients.get(userId);
      if (client) {
        client.emit('message', messageData);
      }
    }
    @SubscribeMessage('sendMessage')
    async handleNewMessage(client: Socket, createMessageDto: CreateMessageDto){
      try{
        await this.rateLimiter.consume(createMessageDto.senderId); 
        const message = await this.messageService.createMessage(createMessageDto);
        const chatObject =  await this.chatService.getChatById(createMessageDto.chatId)
        console.log(message, chatObject)
        for (const participantId of chatObject.participants) {
          this.sendMessageToClient(participantId.toString(), message);
        }
        return("success")
      }catch(error){
        if(error.remainingPoints === 0){
          client.emit("error", {message: "не спам!"})
        }
      }
      
    }
}
