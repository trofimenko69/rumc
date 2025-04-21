import { ApplicantInfo, Prisma, User } from 'prisma/generated';

export interface IApplicantsService {
  createApplicant(
    applicant: Prisma.ApplicantInfoCreateInput,
    email: User['email'],
  ): Promise<ApplicantInfo>;
  getApplicants(): Promise<ApplicantInfo[]>;
  getApplicantById(id: User['id']): Promise<ApplicantInfo>;
  getApplicantByEmail(email: User['email']): Promise<ApplicantInfo>;
  updateApplicant(
    id: User['id'],
    applicant: Prisma.ApplicantInfoUpdateInput,
  ): Promise<ApplicantInfo>;
  deleteApplicant(id: User['id']): Promise<void>;
}
