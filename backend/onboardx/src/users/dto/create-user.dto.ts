import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Некорректный формат email адреса' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  email: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  @Length(2, 50, { message: 'Имя должно быть длиной от 2 до 50 символов' })
  name: string;
}