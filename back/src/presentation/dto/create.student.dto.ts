import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto
  implements Omit<Prisma.StudentInfoCreateInput, 'user'>
{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subdivision?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  educationLevel?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  course?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  educationForm?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  major?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  department?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  group?: string;
}
