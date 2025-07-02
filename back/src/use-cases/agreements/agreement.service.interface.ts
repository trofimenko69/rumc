import { Agreement, Status, Prisma, TypeAgreement } from '@prisma/client';
import {
  CreateAgreementDto,
  UpdateAgreementDto,
} from '@presentation/dto/agreements.dto';

export interface IAgreementService {
  create(
    data: CreateAgreementDto , userId?: string | null,
  ): Promise<Agreement>;
  findAll(id: string, typeAgreement: TypeAgreement): Promise<any>;
  findById(id: string): Promise<Agreement>;
  update(id: string, data: UpdateAgreementDto ): Promise<Agreement>;
  delete(id: string): Promise<void>;
  changeStatus(id: string, status: Status): Promise<Agreement> | any;
}
