import { Pool } from 'pg';

export async function migrateSchemas(
    connectionString: string,
    schemaInitializers: Array<(pool: Pool) => Promise<void>>,
) {
    const pool = new Pool({ connectionString: connectionString });
    await Promise.all(
        schemaInitializers.map(async (initializer) => {
            await initializer(pool);
        }),
    );
    pool.end();
}
