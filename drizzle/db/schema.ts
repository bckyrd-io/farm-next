// import { integer, pgTable, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

// // Branches Table
// export const branchesTable = pgTable('branches', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   location: text('location').notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
// });

// // Users Table
// export const usersTable = pgTable('users', {
//   id: serial('id').primaryKey(),
//   username: text('username').notNull().unique(),
//   passwordHash: text('password_hash').notNull(),
//   email: text('email').notNull().unique(),
//   branchId: integer('branch_id').notNull().references(() => branchesTable.id),
//   role: text('role').notNull().default('Staff'), // Add role column with a default role
//   image: text('image'), // Add image column to store the file path
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
// });

// // Activities Table
// export const activitiesTable = pgTable('activities', {
//   id: serial('id').primaryKey(),
//   description: text('description').notNull(),
//   activityType: text('activity_type').notNull(), // This distinguishes between revenue, expenses, or neutral activities
//   amount: integer('amount').notNull().default(0), // Positive values for revenue, negative for expenses
//   activityDate: date('activity_date').notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// // Resources Table
// export const resourcesTable = pgTable('resources', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   quantity: integer('quantity').notNull().default(0),
//   unit: text('unit'), // Optional for Human resources
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
// });

// // Activity-Resources Link Table
// export const activityResourcesTable = pgTable('activity_resources', {
//   id: serial('id').primaryKey(),
//   activityId: integer('activity_id')
//     .notNull()
//     .references(() => activitiesTable.id, { onDelete: 'cascade' }),
//   resourceId: integer('resource_id')
//     .notNull()
//     .references(() => resourcesTable.id, { onDelete: 'cascade' }),
//   allocatedQuantity: integer('allocated_quantity').default(0), // Optional: Allocated quantity of the resource
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// // Schedules Table
// export const schedulesTable = pgTable('schedules', {
//   id: serial('id').primaryKey(),
//   activityId: integer('activity_id')
//     .notNull()
//     .references(() => activitiesTable.id, { onDelete: 'cascade' }),
//   scheduledDate: date('scheduled_date').notNull(),
//   notificationMessage: text('notification_message'), // Store the notification message
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// // Performance Table
// export const performanceTable = pgTable('performance', {
//     id: serial('id').primaryKey(),
//     userId: integer('user_id')
//       .notNull()
//       .references(() => usersTable.id, { onDelete: 'cascade' }), // Foreign key to users table
//     activityId: integer('activity_id')
//       .notNull()
//       .references(() => activitiesTable.id, { onDelete: 'cascade' }), // Foreign key to activities table
//     status: text('status').notNull().default('Assigned'), // e.g., Assigned, In Progress, Completed
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
//   });
  

import { mysqlTable, int, varchar, timestamp, date } from 'drizzle-orm/mysql-core';

// Branches Table
export const branchesTable = mysqlTable('branches', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Users Table
export const usersTable = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  branchId: int('branch_id').notNull().references(() => branchesTable.id),
  role: varchar('role', { length: 50 }).notNull().default('Staff'),
  image: varchar('image', { length: 255 }), // File path for image
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Activities Table
export const activitiesTable = mysqlTable('activities', {
  id: int('id').primaryKey().autoincrement(),
  description: varchar('description', { length: 255 }).notNull(),
  activityType: varchar('activity_type', { length: 255 }).notNull(),
  amount: int('amount').notNull().default(0),
  activityDate: date('activity_date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Resources Table
export const resourcesTable = mysqlTable('resources', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: int('quantity').notNull().default(0),
  unit: varchar('unit', { length: 50 }), // Optional: e.g., 'kg', 'hours'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Activity-Resources Link Table
export const activityResourcesTable = mysqlTable('activity_resources', {
  id: int('id').primaryKey().autoincrement(),
  activityId: int('activity_id').notNull().references(() => activitiesTable.id, { onDelete: 'cascade' }),
  resourceId: int('resource_id').notNull().references(() => resourcesTable.id, { onDelete: 'cascade' }),
  allocatedQuantity: int('allocated_quantity').default(0), // Optional: Allocated quantity
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Schedules Table
export const schedulesTable = mysqlTable('schedules', {
  id: int('id').primaryKey().autoincrement(),
  activityId: int('activity_id').notNull().references(() => activitiesTable.id, { onDelete: 'cascade' }),
  scheduledDate: date('scheduled_date').notNull(),
  notificationMessage: varchar('notification_message', { length: 255 }), // Notification message
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Performance Table
export const performanceTable = mysqlTable('performance', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  activityId: int('activity_id').notNull().references(() => activitiesTable.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('Assigned'), // Assigned, In Progress, Completed
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
