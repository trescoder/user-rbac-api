import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

interface ErrorMessage {
  text: string;
  status: HttpStatus;
}

const customErrorMessages = new Map<string, ErrorMessage>([
  ['42501', { text: 'Permisos insuficientes.', status: HttpStatus.FORBIDDEN }],
  [
    '23503',
    {
      text: 'Existen referencias al objeto en otras tablas.',
      status: HttpStatus.BAD_REQUEST,
    },
  ],
  [
    '23505',
    {
      text: 'Email or Username already taken.',
      status: HttpStatus.BAD_REQUEST,
    },
  ],
  [
    '2BP01',
    {
      text: 'Existen objetos dependientes, no se puede eliminar.',
      status: HttpStatus.BAD_REQUEST,
    },
  ],
]);

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let errorMessage: ErrorMessage = {
      text: 'Error de consulta, si el problema persiste contacte al administrador',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    console.log(exception);
    if (
      exception.driverError &&
      customErrorMessages.has(exception.driverError.code)
    )
      errorMessage = customErrorMessages.get(exception.driverError.code);

    response.status(errorMessage.status).json({
      message: errorMessage.text,
      statusCode: errorMessage.status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
