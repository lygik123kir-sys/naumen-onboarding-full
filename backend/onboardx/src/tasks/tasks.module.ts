import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from '../prisma.service'; // <-- Добавляем импорт

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService], // <-- Добавляем провайдер
})
export class TasksModule {}