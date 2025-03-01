import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DeviceConfigurationModule } from './devices-configuration/device.configuration.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export function mainConfig(app: INestApplication) {
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
}

async function bootstrap() {
    const app = await NestFactory.create(DeviceConfigurationModule);
    mainConfig(app);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
