import { GraduateInfo, Prisma } from '@prisma/client';

export interface IGraduateService {
  create(
    data: Omit<Prisma.GraduateInfoCreateInput, 'user'>,
    id: string,
  ): Promise<GraduateInfo>;
  findById(id: string): Promise<GraduateInfo>;
  findByEmail(email: string): Promise<GraduateInfo>;
  update(
    id: string,
    data: Prisma.GraduateInfoUpdateInput,
  ): Promise<GraduateInfo>;
  getGraduates(): Promise<GraduateInfo[]>;
  delete(id: string): Promise<void>;
}
