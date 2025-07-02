import { ORGANIZATION_SERVICE_SYMBOL } from '@common/constants';
import { Auth } from '@common/decorators/auth.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrganizationDto } from '@presentation/dto/create.organization.dto';
import { IOrganizationService } from '@use-cases/organization/organization.service.interface';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    @Inject(ORGANIZATION_SERVICE_SYMBOL)
    private readonly organizationService: IOrganizationService,
  ) {}

  @Post()
  @Auth('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Регистрация новой организации' })
  @ApiResponse({ status: 201, description: 'Организация успешно создана' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 409,
    description: 'Такая организация уже существует',
  })
  async create(
    @Body() data: CreateOrganizationDto,
    @CurrentUser('id') id: string,
  ) {
    return await this.organizationService.create(data, id);
  }

  @Get('id/:id')
  @Auth(['ADMIN', 'STUDENT', 'ORGANIZATION', 'MODERATOR'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение организации по id' })
  @ApiResponse({ status: 200, description: 'Организация успешно получена' })
  @ApiResponse({ status: 404, description: 'Организация не найдена' })
  async findById(@Param('id') id: string) {
    return await this.organizationService.findById(id);
  }

  @Get('inn/:inn')
  @Auth(['ADMIN', 'STUDENT', 'ORGANIZATION', 'MODERATOR'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение организации по ИНН' })
  @ApiResponse({ status: 200, description: 'Организация успешно получена' })
  @ApiResponse({ status: 404, description: 'Организация не найдена' })
  async findByInn(@Param('inn') inn: string) {
    return await this.organizationService.findByInn(inn);
  }

  @Put(':id/confirm')
  @Auth('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Подтверждение создание организации для админа' })
  @ApiResponse({ status: 200, description: 'Организация успешно подтверждена' })
  @ApiResponse({ status: 404, description: 'Организация не найдена' })
  async confirm(@Param('id') id: string) {
    return await this.organizationService.confirm(id);
  }

  @Put(':id/reject')
  @Auth('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отклонение создания организации для админа' })
  @ApiResponse({ status: 200, description: 'Организация успешно отклонена' })
  @ApiResponse({ status: 404, description: 'Организация не найдена' })
  async reject(@Param('id') id: string) {
    return await this.organizationService.reject(id);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление организации по id' })
  @ApiResponse({ status: 200, description: 'Организация успешно удалена' })
  @ApiResponse({ status: 404, description: 'Организация не найдена' })
  async remove(@Param('id') id: string) {
    return await this.organizationService.delete(id);
  }
}
