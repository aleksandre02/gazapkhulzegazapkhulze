export default defineEventHandler(async (event) => {
    try {
        const pgModule = await import('pg');
        const Pool = pgModule.default.Pool;

        const config = useRuntimeConfig();

        const pool = new Pool({
            connectionString: config.postgres.url,
            ssl: {
                rejectUnauthorized: false,
                sslmode: 'require'
            }
        });

        // Create table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS click_counter (
        id SERIAL PRIMARY KEY,
        button_id VARCHAR(255) NOT NULL UNIQUE,
        count INTEGER DEFAULT 0,
        last_clicked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pool.end();

        return { success: true, message: "Database setup completed successfully" };
    } catch (error) {
        console.error('Setup error:', error);
        return { success: false, error: error.message };
    }
});