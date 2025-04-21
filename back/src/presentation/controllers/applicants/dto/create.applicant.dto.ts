import { Prisma } from 'prisma/generated';

export class CreateApplicantDto implements Prisma.ApplicantInfoCreateInput {
  id?: string;
  department?: string;
  specialization?: string;
  user: Prisma.UserCreateNestedOneWithoutApplicantInfoInput;
}
