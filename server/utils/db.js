export async function getPostgresClient() {
    const postgres = await import('postgres');
    const config = useRuntimeConfig();

    return postgres.default(config.postgres.url, {
        ssl: { rejectUnauthorized: false }
    });
}