import { Prisma } from '@prisma/client';

export class CreateApplicantDto implements Prisma.ApplicantInfoCreateInput {
  id?: string;
  department?: string;
  specialization?: string;
  user: Prisma.UserCreateNestedOneWithoutApplicantInfoInput;
}
