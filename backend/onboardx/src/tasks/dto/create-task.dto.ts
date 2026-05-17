import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Название задачи должно быть строкой' })
  @IsNotEmpty({ message: 'Название задачи не может быть пустым' })
  @MinLength(3, { message: 'Название задачи должно быть не короче 3 символов' })
  title!: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'ID пользователя должен быть числом' })
  @IsNotEmpty({ message: 'Необходимо указать ID пользователя' })
  userId!: number;
}