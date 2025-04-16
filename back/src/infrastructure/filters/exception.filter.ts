import { ArgumentsHost, HttpException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
