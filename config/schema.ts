import { date, integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(5),
});

export const ProjectsTable = pgTable('project', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar().notNull().references(() => usersTable?.email),
  projectId: varchar().notNull(),
  userInput: varchar().notNull(),
  device: varchar(),
  createdAt: date().defaultNow(),
  config: json(),
  projectVisualDescription: text(),
  theme: varchar(),
  projectName: varchar(),
})

export const ScreenConfigTable = pgTable('screenConfig', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: varchar().notNull().references(() => ProjectsTable?.projectId),
  screenId: varchar().notNull(),
  screenName: varchar(),
  purpose: varchar(),
  screenDescription: varchar(),
  code:text()
})
 