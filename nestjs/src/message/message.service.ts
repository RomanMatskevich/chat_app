import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/Message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserService } from 'src/user/user.service';
import { ChatService } from 'src/chat/chat.service';
import { GetMessagesByChatIdDto } from './dto/get-messages.dto';

const forbiddenWord = /глупость/iu;

@Injectable()
export class MessageService {
  constructor(
    private readonly usersService: UserService,
    private readonly chatService: ChatService,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      const { chatId, senderId, text } = createMessageDto;
      const chatObject = await this.chatService.getChatById(chatId);
      if (!chatObject) {
        throw new NotFoundException(`Chat with ID ${chatId} not found`);
      }
      const senderObject = await this.usersService.getOneById(senderId);
      if (!senderObject) {
        throw new NotFoundException(`User with ID ${senderId} not found`);
      }
      const userExistInChat = chatObject.participants.includes(
        senderObject._id.toString(),
      );
      if (!userExistInChat) {
        throw new ForbiddenException(
          'User with this ID does not exist in chat',
        );
      }
      if (forbiddenWord.test(text)) {
        throw new BadRequestException(
          'Сообщение содержит запрещенное слово: "глупость"',
        );
      }
      const newMessage = new this.messageModel({
        chat: chatObject._id,
        sender: senderObject._id,
        text,
      });
      const createdMessage = (await newMessage.save()).populate({ path: 'sender', select: ['name', '_id']});
      return createdMessage
    } catch (error) {
      console.error('Error in createMessage:', error.message);
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getMessages(id: string) {
    try {
      const messages = await this.messageModel
        .find({ chat: id })
        .populate({
          path: 'sender',
          select: ['name', '_id']
        }).
        exec();
      return messages;
    } catch (error) {
      throw new Error(`Error retrieving messages: ${error.message}`);
    }
  }
}
