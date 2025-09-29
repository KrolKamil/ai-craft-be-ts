import { NestFactory } from '@nestjs/core';
import { AppDatabaseSchemas, AppModule } from './app.module';
import { setup } from './setup';
import { Pool } from 'pg';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    setup(app);

    const pool = app.get<Pool>('DATABASE_POOL');

    await Promise.all(
        AppDatabaseSchemas.map(async (initializer) => {
            await initializer(pool);
        }),
    );

    // Start the server
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
