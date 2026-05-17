import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Создать задачу
  async createTask(data: { title: string; description?: string; userId: number }) {
    return this.prisma.task.create({
      data,
    });
  }

  // Получить задачи пользователя
  async getUserTasks(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  // Универсальное обновление задачи (статус, название, описание)
  async updateTask(id: number, data: { title?: string; description?: string; isCompleted?: boolean }) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  // Удалить задачу
  async deleteTask(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}