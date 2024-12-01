import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('getUserOrCreateUser')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('get/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getOneById(@Param('id') id: string){
    return this.userService.getOneById(id);
  }

  @Get('search')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  findUsersByNameLastName(@Query() queryUsersDto: QueryUsersDto){
    return this.userService.findUsers(queryUsersDto);
  }
}
