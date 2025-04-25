import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApplicantDto implements Prisma.ApplicantInfoCreateInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  department?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  specialization?: string;

  user: Prisma.UserCreateNestedOneWithoutApplicantInfoInput;
}
