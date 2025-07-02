import { GRADUATE_SERVICE_SYMBOL } from '@common/constants';
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateGraduateDto } from '@presentation/dto/create.graduate.dto';
import { IGraduateService } from '@use-cases/graduate/graduate.service.interface';
import { Public } from '@common/decorators/public.decorator';

@Controller('graduate')
export class GraduatesController {
  constructor(
    @Inject(GRADUATE_SERVICE_SYMBOL)
    private readonly graduatesService: IGraduateService,
  ) {}

  @Post('')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Регистрация нового выпускника' })
  @ApiResponse({ status: 201, description: 'Выпускник успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 409,
    description: 'Такой выпускник уже существует',
  })
  async create(@CurrentUser('id') id: string, @Body() data: CreateGraduateDto) {
    return await this.graduatesService.create(data, id);
  }

  @Get('')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение выпускника по id' })
  @ApiResponse({ status: 200, description: 'Выпускник успешно получен' })
  @ApiResponse({ status: 404, description: 'Выпускник не найден' })
  async findById(@CurrentUser('id') id: string) {
    return await this.graduatesService.findById(id);
  }

  @Get('email/:email')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение выпускника по email' })
  @ApiResponse({ status: 200, description: 'Выпускник успешно получен' })
  @ApiResponse({ status: 404, description: 'Выпускник не найден' })
  async findByEmail(@Param('email') email: string) {
    return await this.graduatesService.findByEmail(email);
  }

  @Get('all')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех выпускников' })
  @ApiResponse({ status: 200, description: 'Выпускники успешно получены' })
  async getAll() {
    return await this.graduatesService.getGraduates();
  }

  @Delete('')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление выпускника по id' })
  @ApiResponse({ status: 200, description: 'Выпускник успешно удален' })
  @ApiResponse({ status: 404, description: 'Выпускник не найден' })
  async remove(@CurrentUser('id') id: string) {
    return await this.graduatesService.delete(id);
  }
}
