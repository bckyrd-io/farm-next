// import { sql } from '@vercel/postgres';
// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import { config } from 'dotenv';
// import * as schema from './schema';

// config({ path: '.env.development.local' }); // or .env

// export const db = drizzle(sql, { schema });

import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { config } from 'dotenv';
import * as schema from './schema';

config({ path: '.env.development.local' }); // Load environment variables

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Default MySQL username for XAMPP
  password: '', // Add your MySQL password if applicable
  database: 'db_farm_next', // Replace with your database name
});

// Initialize Drizzle ORM with the MySQL connection pool and schema
export const db = drizzle(pool, {
  schema,
  mode: 'default', // Add the 'mode' property here ('default' or 'strict')
});
