import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { createDatabasePool } from './database-pool.factory';

export interface DatabaseModuleOptions {
    schemaInitializers?: Array<{
        name: string;
        initializer: (pool: Pool) => Promise<void>;
    }>;
}

@Global()
@Module({})
export class DatabaseModule {
    static forRoot(): DynamicModule {
        const databasePoolProvider = {
            provide: 'DATABASE_POOL',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new Pool({
                    connectionString:
                        configService.getOrThrow<string>('DATABASE_URL'),
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
            },
        };

        return {
            module: DatabaseModule,
            imports: [ConfigModule],
            providers: [databasePoolProvider],
            exports: ['DATABASE_POOL'],
        };
    }
}
