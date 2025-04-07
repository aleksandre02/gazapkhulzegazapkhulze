export default defineEventHandler(async (event) => {
    try {
        const { getPostgresClient } = await import('../../utils/db');
        const sql = await getPostgresClient();

        const buttonId = event.context.params.id || 'default-button';

        // First check if the table exists
        const tableCheck = await sql`
      SELECT to_regclass('public.click_counter') as table_exists
    `;

        console.log("Table check in GET:", tableCheck);

        if (!tableCheck[0].table_exists) {
            return {
                error: "Table doesn't exist yet. Please set up the database first.",
                needsSetup: true
            };
        }

        const results = await sql`
      SELECT * FROM click_counter WHERE button_id = ${buttonId}
    `;

        console.log("Query results:", results);

        await sql.end();

        if (results.length > 0) {
            return results[0];
        } else {
            return { button_id: buttonId, count: 0 };
        }
    } catch (error) {
        console.error('Error fetching clicks:', error);
        return { error: error.message };
    }
});