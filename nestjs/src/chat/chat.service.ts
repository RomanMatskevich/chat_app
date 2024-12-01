import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/chat/schemas/Chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserService } from 'src/user/user.service';


@Injectable()
export class ChatService {
    constructor(
      private readonly usersService: UserService,
      @InjectModel(Chat.name) private chatModel: Model<Chat>
    ) {}
    async createChat(createChatDto: CreateChatDto) {
        const { participants } = createChatDto;
        const uniqueParticipantsIds = Array.from(new Set(participants))
        const usersCount = uniqueParticipantsIds.length
        const usersObjects = await Promise.all(uniqueParticipantsIds.map(id => this.usersService.getOneById(id)))
        try {
            const chat = await this.chatModel.findOne({
              $and: [
                { participants: { $all: uniqueParticipantsIds } },
                { participants: { $size: usersCount } }
              ]
            })
            if(!chat){
                const chatName = usersObjects.map(user => user.name).join(', ')
                const newChat = new this.chatModel({ name: chatName, participants: uniqueParticipantsIds });
                const createdChat = await newChat.save();
                this.usersService.updateUsersChats({participants: uniqueParticipantsIds, chatId: newChat._id.toString()})
                return createdChat
            }
            return chat;
          } catch (error) {
            if(error.kind === "objectId"){
              throw new BadRequestException("Object id uncorect")
            }
            throw new InternalServerErrorException('Failed to create chat', error.message);
          }
      }
      async getChatById(chatId: string){
        try {
          const chat = await this.chatModel.findById(chatId).exec();
          if (!chat) {
            throw new NotFoundException(`Chat with ID ${chatId} not found`);
          }
          return chat;
        } catch (error) {
          if(error.kind === "objectId"){
            throw new BadRequestException("Object id uncorect")
          }
          throw new InternalServerErrorException('An error occurred while fetching the chat');
        }
      }
      async getChatsByIds(ids: string) {
        const arrayIds = JSON.parse(ids)
        try {
          if (!Array.isArray(arrayIds) || arrayIds.some((id) => typeof id !== 'string')) {
            throw new BadRequestException('Invalid input: IDs must be an array of strings');
          }
          const chats = await this.chatModel.find({ _id: { $in: arrayIds } }).exec();
          return chats;
        } catch (error) {
          if (error.kind === 'ObjectId') {
            throw new BadRequestException('Invalid ObjectId format');
          }
          throw new InternalServerErrorException('An error occurred while fetching chats');
        }
      }
      
}
