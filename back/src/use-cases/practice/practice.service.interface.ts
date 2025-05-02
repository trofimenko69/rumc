import { Practice, PracticeStatus, Prisma } from '@prisma/client';

export interface IPracticeService {
  create(
    data: Prisma.PracticeCreateInput[],
    organizationId: string,
  ): Promise<Prisma.BatchPayload>;
  findAll(organizationId: string): Promise<Practice[]>;
  findById(id: string): Promise<Practice>;
  update(id: string, data: Prisma.PracticeUpdateInput): Promise<Practice>;
  delete(id: string): Promise<void>;
  changeStatus(id: string, status: PracticeStatus): Promise<Practice>;
}
