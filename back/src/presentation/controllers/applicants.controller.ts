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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApplicantInfo, Prisma } from '@prisma/client';
import { IApplicantsService } from '@use-cases/applicants';

@Controller('applicants')
export class ApplicantsController {
  constructor(
    @Inject('applicantsService')
    private readonly applicantsService: IApplicantsService,
  ) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Регистрация нового абитуриента' })
  @ApiResponse({ status: 201, description: 'Абитуриент успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  async createApplicant(
    @Body() applicant: Prisma.ApplicantInfoCreateInput & { email: string },
  ): Promise<ApplicantInfo> {
    return await this.applicantsService.createApplicant(
      applicant,
      applicant.email,
    );
  }

  @Get()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех абитуриентов' })
  @ApiResponse({ status: 200, description: 'Абитуриенты успешно получены' })
  async getApplicants(): Promise<ApplicantInfo[]> {
    return await this.applicantsService.getApplicants();
  }

  @Get('userId/:id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение абитуриента по id' })
  @ApiResponse({ status: 200, description: 'Абитуриент успешно получен' })
  @ApiResponse({ status: 404, description: 'Абитуриент не найден' })
  async getApplicantById(@Param('id') id: string): Promise<ApplicantInfo> {
    return await this.applicantsService.getApplicantById(id);
  }

  @Get('email/:email')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение абитуриента по email' })
  @ApiResponse({ status: 200, description: 'Абитуриент успешно получен' })
  @ApiResponse({ status: 404, description: 'Абитуриент не найден' })
  async getApplicantByEmail(
    @Param('email') email: string,
  ): Promise<ApplicantInfo> {
    return await this.applicantsService.getApplicantByEmail(email);
  }

  @Put(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление абитуриента' })
  @ApiResponse({ status: 200, description: 'Абитуриент успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Абитуриент не найден' })
  async updateApplicant(
    @Param('id') id: string,
    @Body() applicant: Prisma.ApplicantInfoUpdateInput,
  ): Promise<ApplicantInfo> {
    return await this.applicantsService.updateApplicant(id, applicant);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление абитуриента' })
  @ApiResponse({ status: 200, description: 'Абитуриент успешно удален' })
  @ApiResponse({ status: 404, description: 'Абитуриент не найден' })
  async deleteApplicant(@Param('id') id: string): Promise<void> {
    return await this.applicantsService.deleteApplicant(id);
  }
}
