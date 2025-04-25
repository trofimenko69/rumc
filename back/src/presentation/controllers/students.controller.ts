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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateStudentDto } from '@presentation/dto/create.student.dto';
import { IStudentService } from '@use-cases/students/students.service.interface';

@Controller('students')
export class StudentsController {
  constructor(
    @Inject('studentsService')
    private readonly studentsService: IStudentService,
  ) {}

  @Post('')
  @Auth()
  @ApiOperation({ summary: 'Регистрация нового студента' })
  @ApiResponse({ status: 201, description: 'Студент успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({
    status: 409,
    description: 'Такой студент уже существует',
  })
  async create(@Body() data: CreateStudentDto, @CurrentUser('id') id: string) {
    return await this.studentsService.create(data, id);
  }

  @Get('')
  @Auth('STUDENT')
  @ApiOperation({ summary: 'Получение студента по id' })
  @ApiResponse({ status: 200, description: 'Студент успешно получен' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  async findById(@CurrentUser('id') id: string) {
    return await this.studentsService.findById(id);
  }

  @Get('email/:email')
  @Auth()
  @ApiOperation({ summary: 'Получение студента по email' })
  @ApiResponse({ status: 200, description: 'Студент успешно получен' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  async findByEmail(@Param('email') email: string) {
    return await this.studentsService.findByEmail(email);
  }

  @Get('all')
  @Auth()
  @ApiOperation({ summary: 'Получение всех студентов' })
  @ApiResponse({ status: 200, description: 'Студенты успешно получены' })
  async getAll() {
    return await this.studentsService.getStudents();
  }

  @Delete('')
  @Auth()
  @ApiOperation({ summary: 'Удаление студента по id' })
  @ApiResponse({ status: 200, description: 'Студент успешно удален' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  async remove(@CurrentUser('id') id: string) {
    return await this.studentsService.delete(id);
  }
}
