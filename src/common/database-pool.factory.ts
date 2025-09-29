import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

/**
 * Factory function that creates a PostgreSQL connection pool
 * @param configService - NestJS ConfigService instance
 * @param schemaInitializer - Optional function to initialize database schema
 * @returns Configured PostgreSQL Pool instance
 */
export function createDatabasePool(
    configService: ConfigService,
    schemaInitializer: Array<(pool: Pool) => Promise<void>>,
): Pool {
    const pool = new Pool({
        connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        max: configService.get<number>('POSTGRES_POOL_MAX', 20),
        idleTimeoutMillis: configService.get<number>(
            'POSTGRES_IDLE_TIMEOUT_MS',
            30000,
        ),
        connectionTimeoutMillis: configService.get<number>(
            'POSTGRES_CONNECTION_TIMEOUT_MS',
            10000,
        ),
        allowExitOnIdle: true,
    });

    // Initialize schema if provided
    Promise.all(
        schemaInitializer.map(async (initializer) => {
            await initializer(pool);
        }),
    );

    return pool;
}
