import { Competence } from '@prisma/client';
import { CreateCompetenceDto, UpdateCompetenceDto } from '@presentation/dto/competence.dto';

export interface ICompetenceService {
  create(
    data: CreateCompetenceDto,
    organizationId: String
  ): Promise<Competence>;
  findAllByOrganization(organizationId: string): Promise<Competence[]>;
  findById(id: string): Promise<Competence>;
  findAll(): Promise<any []>;
  update(id: string, data: UpdateCompetenceDto): Promise<Competence>;
  delete(id: string): Promise<void>;
}
