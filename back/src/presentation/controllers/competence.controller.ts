import { Auth } from '@common/decorators/auth.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CreateCompetenceDto,
  UpdateCompetenceDto,
} from '@presentation/dto/competence.dto';
import { ICompetenceService } from '@use-cases/competence/competence.service.interfece';
import { COMPETENCE_SERVICE_SYMBOL, ORGANIZATION_SERVICE_SYMBOL } from '@common/constants';
import { CurrentUser } from '@common/decorators/user.decorator';
import { OrganizationsService } from '@use-cases/organization/organization.service';

@Controller('competence')
export class CompetenceController {
  constructor(
    @Inject(COMPETENCE_SERVICE_SYMBOL)
    private readonly competenceService: ICompetenceService,
    @Inject(ORGANIZATION_SERVICE_SYMBOL)
    private readonly organizationService: OrganizationsService,
  ) {}

  @Post('')
  @Auth(['ORGANIZATION'])
  @ApiBearerAuth()
  @ApiBody({ type: CreateCompetenceDto })
  @ApiResponse({ status: 201, description: 'Компетенция успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  async create(
    @Body() data: CreateCompetenceDto,
    @CurrentUser('id') id: string
  ) {

    const organization = await this.organizationService.findByUserId(id)

    if(!organization) {
      throw new BadRequestException('organization not exist')
    }

    return await this.competenceService.create(
      data,
      organization.id
    );
  }

  @Get(':organizationId')
  @Auth(['ADMIN', 'ORGANIZATION', 'MODERATOR', 'STUDENT'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'organizationId',
    type: 'string',
    description: 'Идентификатор организации',
  })
  @ApiResponse({ status: 200, description: 'Список компетенций успешно получен.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Организация не найдена.' })
  async findAllByOrganization(@Param('organizationId') organizationId: string) {
    return await this.competenceService.findAllByOrganization(organizationId);
  }


  @Get('')
  @Auth(['ADMIN', 'ORGANIZATION', 'MODERATOR', 'STUDENT'])
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Список компетенций успешно получен.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  async findAll() {
    return await this.competenceService.findAll();
  }

  @Get(':id')
  @Auth(['ADMIN', 'ORGANIZATION', 'MODERATOR', 'STUDENT'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор компетенции',
  })
  @ApiResponse({ status: 200, description: 'Компетенция успешно найдена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Компетенция не найдена.' })
  async findById(@Param('id') id: string) {
    return await this.competenceService.findById(id);
  }

  @Put(':id')
  @Auth('ORGANIZATION')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор компетенции',
  })
  @ApiBody({ type: UpdateCompetenceDto })
  @ApiResponse({ status: 200, description: 'Компетенция успешно обновлена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Компетенция не найдена.' })
  async update(@Param('id') id: string, @Body() data: UpdateCompetenceDto) {
    return await this.competenceService.update(
      id,
      data
    );
  }

  @Delete(':id')
  @Auth(['ORGANIZATION'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор компетенции',
  })
  @ApiResponse({ status: 200, description: 'Компетенция успешно удалена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
  @ApiResponse({ status: 404, description: 'Компетенция не найдена.' })
  async delete(@Param('id') id: string) {
    await this.competenceService.delete(id);
    return { message: 'Компетенция успешно удалена.', success: true };
  }
}
