import { Organization, Prisma } from '@prisma/client';

export interface IOrganizationService {
  create(
    data: Omit<Prisma.OrganizationCreateInput, 'user'>,
    id: string,
  ): Promise<Organization>;
  findById(id: string): Promise<Organization>;
  findByInn(inn: string): Promise<Organization>;
  confirm(id: string): Promise<Organization>;
  reject(id: string): Promise<void>;
  update(
    id: string,
    data: Prisma.OrganizationUpdateInput,
  ): Promise<Organization>;
  delete(id: string): Promise<void>;
}
