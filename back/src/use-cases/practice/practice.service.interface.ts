import { Practice, PracticeStatus, Prisma } from '@prisma/client';
import { CreatePracticeDto, UpdatePracticeDto } from '@presentation/dto/practice.dto';

export interface IPracticeService {
  create(
    data: CreatePracticeDto,
  ): Promise<Practice>;
  findAll(): Promise<Practice[]>;
  findById(id: string): Promise<Practice>;
  update(id: string, data: UpdatePracticeDto): Promise<Practice>;
  delete(id: string): Promise<void>;
  changeStatus(id: string, status: PracticeStatus): Promise<Practice>;
}
