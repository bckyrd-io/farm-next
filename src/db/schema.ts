import { integer, pgTable, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

// Users Table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  email: text('email').notNull().unique(),
  branchId: integer('branch_id').notNull().references(() => branchesTable.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
});

// Persons Table
export const personsTable = pgTable('persons', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  hourlyRate: integer('hourly_rate').notNull(), // Rate for activities with costs
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

// Activity Persons Table
export const activityPersonsTable = pgTable('activity_persons', {
  activityId: integer('activity_id').notNull().references(() => activitiesTable.id, { onDelete: 'cascade' }),
  personId: integer('person_id').notNull().references(() => personsTable.id, { onDelete: 'cascade' }),
  workHours: integer('work_hours').notNull(), // Hours worked by the person on the activity
});

// Inventory Table
export const inventoryTable = pgTable('inventory', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull().default(0),
  unit: text('unit').notNull(), // e.g., kg, liters, pieces
  threshold: integer('threshold').notNull().default(0), // Minimum required to trigger restock notification
  activityId: integer('activity_id').notNull().references(() => activitiesTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
});

// Schedules Table
export const schedulesTable = pgTable('schedules', {
  id: serial('id').primaryKey(),
  activityId: integer('activity_id').notNull().references(() => activitiesTable.id, { onDelete: 'cascade' }),
  scheduledDate: date('scheduled_date').notNull(),
  notificationSent: integer('notification_sent').notNull().default(0), // 0 for false, 1 for true
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Branches Table
export const branchesTable = pgTable('branches', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdateFn(() => new Date()),
});
