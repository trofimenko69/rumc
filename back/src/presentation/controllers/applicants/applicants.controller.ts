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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IApplicantsService } from '@use-cases/applicants';
import { ApplicantInfo, Prisma } from 'prisma/generated';

@Controller('applicants')
export class ApplicantsController {
  constructor(
    @Inject('applicantsService')
    private readonly applicantsService: IApplicantsService,
  ) {}

  @Post()
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
  @ApiOperation({ summary: 'Получение всех абитуриентов' })
  @ApiResponse({ status: 200, description: 'Абитуриенты успешно получены' })
  async getApplicants(): Promise<ApplicantInfo[]> {
    return await this.applicantsService.getApplicants();
  }

  @Get('userId/:id')
  @ApiOperation({ summary: 'Получение абитуриента по id' })
  @ApiResponse({ status: 200, description: 'Абитуриент успешно получен' })
  @ApiResponse({ status: 404, description: 'Абитуриент не найден' })
  async getApplicantById(@Param('id') id: string): Promise<ApplicantInfo> {
    return await this.applicantsService.getApplicantById(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Получение абитуриента по email' })
  @ApiResponse({ status: 200, description: 'Абитуриент успешно получен' })
  @ApiResponse({ status: 404, description: 'Абитуриент не найден' })
  async getApplicantByEmail(
    @Param('email') email: string,
  ): Promise<ApplicantInfo> {
    return await this.applicantsService.getApplicantByEmail(email);
  }

  @Put(':id')
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
  @ApiOperation({ summary: 'Удаление абитуриента' })
  @ApiResponse({ status: 200, description: 'Абитуриент успешно удален' })
  @ApiResponse({ status: 404, description: 'Абитуриент не найден' })
  async deleteApplicant(@Param('id') id: string): Promise<void> {
    return await this.applicantsService.deleteApplicant(id);
  }
}
