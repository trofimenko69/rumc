import { PRACTICE_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CreatePracticeDto,
  UpdatePracticeDto,
} from '@presentation/dto/practice.dto';
import { PracticeStatus } from '@prisma/client';
import { IPracticeService } from '@use-cases/practice/practice.service.interface';

@Controller('practice')
export class PracticeController {
  constructor(
    @Inject(PRACTICE_SERVICE_SYMBOL)
    private readonly practiceService: IPracticeService,
  ) {}

  @Post('')
  @Auth(['ADMIN', 'MODERATOR'])
  @ApiBearerAuth()
  @ApiBody({ type: CreatePracticeDto })
  @ApiResponse({ status: 201, description: 'Практика успешно создана.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  async create(
    @Body() data: CreatePracticeDto,
  ) {

    const practice = await this.practiceService.create(
      data,
    );
    return practice;
  }

  @Get('')
  @Auth(['ADMIN', 'MODERATOR'])
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Список практик успешно получен.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Организация не найдена.' })
  async findAll() {
    const practices = await this.practiceService.findAll();
    return practices;
  }

  @Get(':id')
  @Auth(['ADMIN', 'ORGANIZATION', 'MODERATOR', 'STUDENT'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор практики',
  })
  @ApiResponse({ status: 200, description: 'Практика успешно найдена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Практика не найдена.' })
  async findById(@Param('id') id: string) {
    const practice = await this.practiceService.findById(id);
    return practice;
  }

  @Put(':id')
  @Auth(['ADMIN', 'MODERATOR'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор практики',
  })
  @ApiBody({ type: UpdatePracticeDto })
  @ApiResponse({ status: 200, description: 'Практика успешно обновлена.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Практика не найдена.' })
  async update(@Param('id') id: string, @Body() data: UpdatePracticeDto) {

    const updatedPractice = await this.practiceService.update(
      id,
      data
    );
    return updatedPractice;
  }

  @Put(':id/status')
  @Auth('ADMIN')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор практики',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(PracticeStatus),
          description: 'Новый статус практики',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Статус практики успешно обновлен.',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
  @ApiResponse({ status: 404, description: 'Практика не найдена.' })
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: PracticeStatus,
  ) {
    const practice = await this.practiceService.changeStatus(id, status);
    return practice;
  }

  @Delete(':id')
  @Auth('ADMIN')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор практики',
  })
  @ApiResponse({ status: 200, description: 'Практика успешно удалена.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
  @ApiResponse({ status: 404, description: 'Практика не найдена.' })
  async delete(@Param('id') id: string) {
    await this.practiceService.delete(id);
    return { message: 'Практика успешно удалена.', success: true };
  }
}
