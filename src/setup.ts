import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/global-exception.filter';

export function setup(app: INestApplication): void {
    app.useGlobalFilters(new GlobalExceptionFilter());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: false, // Strip properties that don't have decorators
            transform: true, // Transform payloads to be objects typed according to their DTO classes
            forbidNonWhitelisted: false, // Throw errors if non-whitelisted values are provided
            stopAtFirstError: false, // Check all validation errors, not just the first one
            transformOptions: {
                enableImplicitConversion: true, // Automatically transform primitive types
            },
        }),
    );

    // Enable CORS
    app.enableCors({
        origin: [
            'http://localhost:5173', // Vite default port
            'http://localhost:5173/',
            'http://localhost:8080',
            'http://localhost:8081',
            'http://localhost:8080/',
            'http://localhost:8081/',
            ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true, // Allow credentials if needed
    });
}
