// server/api/postgres-test.get.js
export default defineEventHandler(async (event) => {
    try {
        const postgres = await import('postgres');
        const sql = postgres.default({
            ssl: { rejectUnauthorized: false },
            connectionString: useRuntimeConfig().postgres.url
        });

        const result = await sql`SELECT NOW() as time`;

        await sql.end();

        return {
            success: true,
            message: "Connection successful with postgres.js",
            time: result[0].time
        };
    } catch (error) {
        console.error('Postgres.js test error:', error);
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
});