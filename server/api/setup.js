export default defineEventHandler(async (event) => {
    try {
        const { getPostgresClient } = await import('../utils/db');
        const sql = await getPostgresClient();

        console.log("Creating click_counter table...");

        // Create table with more verbose logging
        await sql`
      CREATE TABLE IF NOT EXISTS click_counter (
        id SERIAL PRIMARY KEY,
        button_id TEXT NOT NULL UNIQUE,
        count INTEGER DEFAULT 0,
        last_clicked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        console.log("Table creation SQL executed");

        // Verify the table exists
        const tableCheck = await sql`
      SELECT to_regclass('public.click_counter') as table_exists
    `;

        console.log("Table check result:", tableCheck);

        await sql.end();

        return {
            success: true,
            message: "Database setup completed successfully",
            tableExists: tableCheck[0].table_exists !== null
        };
    } catch (error) {
        console.error('Setup error:', error);
        return { success: false, error: error.message, stack: error.stack };
    }
});