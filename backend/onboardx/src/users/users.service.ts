import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. Создать нового пользователя
  async create(data: { email: string; name: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  // 2. Получить всех пользователей (с задачами и их ментором)
  async findAll() {
    return this.prisma.user.findMany({
      include: {
        tasks: true,
        mentor: true, // Подтягиваем инфо о менторе
        newbies: true, // Если это ментор, подтянем его новичков
      },
    });
  }

  // 3. Удаление пользователя
  async deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
// 4. Обновление данных пользователя (с правильной привязкой ментора)
  async update(userId: number, data: { email?: string; name?: string; role?: string; mentorId?: number }) {
    const { mentorId, ...restData } = data;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...restData,
        // Если mentorId передан, связываем через специальный connect
        ...(mentorId ? { mentor: { connect: { id: mentorId } } } : {}),
      },
    });
  }
  

  // 5. Фильтрация пользователей по роли (сразу видим, кто чей ментор)
  async findByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role },
      include: { 
        tasks: true,
        mentor: true,
        newbies: true,
      },
    });
  }
}