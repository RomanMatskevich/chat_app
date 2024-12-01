import { Model, Types } from 'mongoose';
import {
    ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/User.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { AddUserToChatDto } from './dto/add-user-to-chat.dto';
import { UpdateUsersChatsDto } from './dto/update-users-chat.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { name, lastName } = createUserDto;
    try {
        const user = await this.userModel.findOne({ name, lastName }).populate('chats').exec()
        if(!user){
            const newUser = new this.userModel({ name, lastName });
            const createdUser = await newUser.save();
            return createdUser
        }
        console.log(user)
        return user;
      } catch (error) {
        if (error.code === 11000) {
          throw new ConflictException('A user with the same name and last name already exists');
        }
        throw new InternalServerErrorException('Failed to create user', error.message);
      }
  }

  getOneById(id: string) {
    try {
      const user = this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User with this id doesn`t exist');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to load user',
        error.message,
      );
    }
  }

  async addUserToChat(addUserToChatDto: AddUserToChatDto) {
    const { userId, chatId } = addUserToChatDto
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
        $push: { chats: new Types.ObjectId(chatId) },
      }, {new: true})
      return updatedUser
    }catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to load user',
        error.message,
      );
    }
  }

  async updateUsersChats(updateUsersChatsDto: UpdateUsersChatsDto) {
    const { participants, chatId } = updateUsersChatsDto
    await this.userModel.updateMany(
      { _id: { $in: participants } },
      { $addToSet: { chats: chatId } }
    );
  }

  findUsers(queryUsersDto: QueryUsersDto) {
    try {
      const users = this.userModel.find({
        $or: [
          { name: { $regex: queryUsersDto.name, $options: 'i' } },
          { lastName: { $regex: queryUsersDto.lastName, $options: 'i' } },
        ],
      });
      return users
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to load user',
        error.message,
      );
    }
  }
}
