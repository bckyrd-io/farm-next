import { integer, pgTable, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

// Branches Table
export const branchesTable = pgTable('branches', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
});

// Users Table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  email: text('email').notNull().unique(),
  branchId: integer('branch_id').notNull().references(() => branchesTable.id),
  role: text('role').notNull().default('Staff'), // Add role column with a default role
  image: text('image'), // Add image column to store the file path
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
});

// Activities Table
export const activitiesTable = pgTable('activities', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  activityType: text('activity_type').notNull(), // This distinguishes between revenue, expenses, or neutral activities
  amount: integer('amount').notNull().default(0), // Positive values for revenue, negative for expenses
  activityDate: date('activity_date').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Resources Table
export const resourcesTable = pgTable('resources', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull().default(0),
  unit: text('unit'), // Optional for Human resources
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
});

// Activity-Resources Link Table
export const activityResourcesTable = pgTable('activity_resources', {
  id: serial('id').primaryKey(),
  activityId: integer('activity_id')
    .notNull()
    .references(() => activitiesTable.id, { onDelete: 'cascade' }),
  resourceId: integer('resource_id')
    .notNull()
    .references(() => resourcesTable.id, { onDelete: 'cascade' }),
  allocatedQuantity: integer('allocated_quantity').default(0), // Optional: Allocated quantity of the resource
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Schedules Table
export const schedulesTable = pgTable('schedules', {
  id: serial('id').primaryKey(),
  activityId: integer('activity_id')
    .notNull()
    .references(() => activitiesTable.id, { onDelete: 'cascade' }),
  scheduledDate: date('scheduled_date').notNull(),
  notificationMessage: text('notification_message'), // Store the notification message
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Performance Table
export const performanceTable = pgTable('performance', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }), // Foreign key to users table
    activityId: integer('activity_id')
      .notNull()
      .references(() => activitiesTable.id, { onDelete: 'cascade' }), // Foreign key to activities table
    status: text('status').notNull().default('Assigned'), // e.g., Assigned, In Progress, Completed
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
  });
  
