import { Job, Prisma } from '@prisma/client';
import { CreateJobDto, UpdateJobDto } from '@presentation/dto/job.dto';

export interface IJobService {
  create(
    data: CreateJobDto,
    organizationId: String
  ): Promise<Job>;
  findAll(organizationId: string): Promise<Job[]>;
  findById(id: string): Promise<Job>;

  update(id: string, data: UpdateJobDto): Promise<Job>;
  delete(id: string): Promise<void>;
}
