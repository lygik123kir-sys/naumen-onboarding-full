import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 1. Создать задачу
  @Post()
  async createTask(@Body() body: { title: string; description?: string; userId: number }) {
    return this.tasksService.createTask(body);
  }

  // 2. Получить все задачи конкретного пользователя
  @Get('user/:userId')
  async getUserTasks(@Param('userId') userId: string) {
    return this.tasksService.getUserTasks(Number(userId));
  }

  // 3. Обновить задачу (текст, описание или статус выполнения)
  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; isCompleted?: boolean }
  ) {
    return this.tasksService.updateTask(Number(id), body);
  }

  // 4. Удалить задачу
  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(Number(id));
  }
}