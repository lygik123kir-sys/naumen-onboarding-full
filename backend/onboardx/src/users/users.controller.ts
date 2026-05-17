import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('role/:roleName')
  findByRole(@Param('roleName') roleName: string) {
    return this.usersService.findByRole(roleName.toUpperCase());
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() body: { email?: string; name?: string; role?: string; mentorId?: number }
  ) {
    return this.usersService.update(Number(id), body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}