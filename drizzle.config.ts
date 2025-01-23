// import { config } from 'dotenv';
// import { defineConfig } from 'drizzle-kit';

// config({ path: '.env.development.local' });

// export default defineConfig({
//   schema: './drizzle/db/schema.ts',
//   out: './migrations',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.POSTGRES_URL!,
//   },
// });




import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load environment variables
config({ path: '.env.development.local' });

export default defineConfig({
    schema: './drizzle/db/schema.ts', // Path to your schema file
    out: './drizzle/migrations', // Directory for migration files
    dialect: "mysql", // Use MySQL as the database dialect
    dbCredentials: {
        url: process.env.DATABASE_URL!, // Use the DATABASE_URL directly
    },
});

