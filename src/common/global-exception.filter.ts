import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CommandInvalidError, OptimisticLockError } from './errors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let retryAfter: number | undefined;

        // Handle OptimisticLockError - return 409 Conflict with Retry-After header
        if (exception instanceof OptimisticLockError) {
            status = HttpStatus.CONFLICT;
            message = exception.message;
            retryAfter = 1; // Retry after 1 second
            this.logger.warn(`Optimistic lock conflict: ${exception.message}`, {
                url: request.url,
                method: request.method,
                body: request.body,
            });
        }
        // Handle CommandInvalidError - return 400 Bad Request
        else if (exception instanceof CommandInvalidError) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
            this.logger.warn(`Command invalid: ${exception.message}`, {
                url: request.url,
                method: request.method,
                body: request.body,
            });
        }
        // Handle HttpException (NestJS built-in exceptions)
        else if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        }
        // Handle other errors
        else {
            this.logger.error(
                {
                    url: request.url,
                    method: request.method,
                    body: request.body,
                },
                exception,
            );
        }

        const errorResponse = {
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        // Set Retry-After header for optimistic lock conflicts
        if (retryAfter) {
            response.setHeader('Retry-After', retryAfter);
        }

        response.status(status).json(errorResponse);
    }
}
