export default defineEventHandler(async (event) => {
    try {
        const { getPostgresClient } = await import('../../utils/db');
        const sql = await getPostgresClient();

        // First check if the table exists
        const tableCheck = await sql`
      SELECT to_regclass('public.click_counter') as table_exists
    `;

        console.log("Table check in POST:", tableCheck);

        if (!tableCheck[0].table_exists) {
            return {
                error: "Table doesn't exist yet. Please set up the database first.",
                needsSetup: true
            };
        }

        const body = await readBody(event);
        const buttonId = body.id || 'default-button';

        // First check if the button_id exists
        const exists = await sql`
      SELECT COUNT(*) as count FROM click_counter WHERE button_id = ${buttonId}
    `;

        let result;

        if (exists[0].count > 0) {
            // Update existing record
            result = await sql`
        UPDATE click_counter 
        SET count = count + 1, last_clicked = NOW() 
        WHERE button_id = ${buttonId}
        RETURNING *
      `;
        } else {
            // Insert new record
            result = await sql`
        INSERT INTO click_counter (button_id, count, last_clicked)
        VALUES (${buttonId}, 1, NOW())
        RETURNING *
      `;
        }

        await sql.end();

        return result[0];
    } catch (error) {

        console.error('Error incrementing clicks:', error);
        return { error: error.message };
    }
});