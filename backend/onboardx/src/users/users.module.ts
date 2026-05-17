import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service'; // <-- Обязательно импортируем!

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService], // <-- Добавляем PrismaService сюда
})
export class UsersModule {}