import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { Pool } from 'pg';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './common/database.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        DatabaseModule.forRoot(),
        CommonModule,
    ],
})
export class AppModule {}

export const AppDatabaseSchemas: ((pool: Pool) => Promise<void>)[] = [];
