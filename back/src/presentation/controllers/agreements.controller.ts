import { AGREEMENTS_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateAgreementDto, UpdateAgreementDto } from '@presentation/dto/agreements.dto';
import { Status, TypeAgreement, Role } from '@prisma/client';
import { IAgreementService } from '@use-cases/agreements/agreement.service.interface';
import { CurrentUser } from '@common/decorators/user.decorator';

@Controller('agreements')
export class AgreementsController {
  constructor(
    @Inject(AGREEMENTS_SERVICE_SYMBOL)
    private readonly agreementService: IAgreementService,
  ) {}

  @Post('')
  @Auth(['ORGANIZATION', 'STUDENT'])
  @ApiBearerAuth()
  @ApiBody({ type: CreateAgreementDto  })
  @ApiResponse({ status: 201, description: 'Соглашение успешно создано.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  async create(
    @Body() data: CreateAgreementDto,
    @CurrentUser() user
  ) {


    if(user.role === Role.STUDENT) {
      return await this.agreementService.create(
        data,
        user.id
      );
    }

    if(!data.userId) {
      throw new BadRequestException('userId is empty')
    }
    return await this.agreementService.create(
      data,
    )


  }

  @Get('')
  @Auth(['STUDENT'])
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Список практик успешно получен.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Организация не найдена.' })
  @ApiQuery({ name: 'typeAgreement', required: true, description: 'Тип соглашения' })
  async findAll(@CurrentUser('id') id: string, @Query('typeAgreement') typeAgreement: TypeAgreement) {
    return await this.agreementService.findAll(id,typeAgreement);
  }

  @Get(':id')
  @Auth(['ADMIN', 'ORGANIZATION', 'MODERATOR', 'STUDENT'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор соглашения',
  })
  @ApiResponse({ status: 200, description: 'Соглашение успешно найдено.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Соглашение не найдено.' })
  async findById(@Param('id') id: string) {
    return await this.agreementService.findById(id);
  }

  @Put(':id')
  @Auth(['ADMIN', 'ORGANIZATION', 'MODERATOR', 'STUDENT'])
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор соглашения',
  })
  @ApiBody({ type: UpdateAgreementDto })
  @ApiResponse({ status: 200, description: 'Соглашение успешно обновлено.' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 404, description: 'Соглашение не найдена.' })
  async update(@Param('id') id: string, @Body() data: UpdateAgreementDto) {
    return await this.agreementService.update(
      id,
      data
    );

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
          enum: Object.values(Status),
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
    @Body('status') status: Status,
  ) {
    return await this.agreementService.changeStatus(id, status);
  }

  @Delete(':id')
  @Auth('ADMIN')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Идентификатор соглашения',
  })
  @ApiResponse({ status: 200, description: 'Соглашение успешно удалено.' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ.' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен.' })
  @ApiResponse({ status: 404, description: 'Соглашение не найдено.' })
  async delete(@Param('id') id: string) {
    await this.agreementService.delete(id);
    return { message: 'Соглашение успешно удалено.', success: true };
  }
}
