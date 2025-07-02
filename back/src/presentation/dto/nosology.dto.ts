import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNosologyDto {
  @ApiProperty({ description: 'Название нозологии' })
  @IsNotEmpty({ message: 'Поле name не должно быть пустым' })
  @IsString({ message: 'Поле name должно быть строкой' })
  name: string;
}