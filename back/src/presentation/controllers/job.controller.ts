import { Auth } from '@common/decorators/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CreateJobDto,
  UpdateJobDto,
} from '@presentation/dto/job.dto';
import { IJobService } from '@use-cases/job/job.service.interface';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: IJobService,
  ) {}

  @Post('')
  @Auth(['ORGANIZATION'])
  @ApiBearerAuth()
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 201, description: 'Вакансия успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  async create(
    @Body() data: CreateJobDto,
    @Body() organizationId: string,
  ) {
    return await this.jobService.create(
      data,
      organizationId
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
  @ApiResponse({ status: 200, description: 'Список вакансий успешно получен.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Организация не найдена.' })
  async findAll(@Param('organizationId') organizationId: string) {
    return await this.jobService.findAll(organizationId);
  }

  @Get(':id')
  @Auth(['ADMIN', 'ORGANIZATION', 'MODERATOR', 'STUDENT'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор вакансии',
  })
  @ApiResponse({ status: 200, description: 'Вакансия успешно найдена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Вакансия не найдена.' })
  async findById(@Param('id') id: string) {
    return await this.jobService.findById(id);
  }

  @Put(':id')
  @Auth('ORGANIZATION')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор вакансии',
  })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({ status: 200, description: 'Вакансия успешно обновлена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Вакансия не найдена.' })
  async update(@Param('id') id: string, @Body() data: UpdateJobDto) {
    return await this.jobService.update(
      id,
      data
    );
  }

  @Delete(':id')
  @Auth(['ORGANIZATION', 'ADMIN'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор вакансии',
  })
  @ApiResponse({ status: 200, description: 'Вакансия успешно удалена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
  @ApiResponse({ status: 404, description: 'Вакансия не найдена.' })
  async delete(@Param('id') id: string) {
    await this.jobService.delete(id);
    return { message: 'Вакансия успешно удалена.', success: true };
  }
}
