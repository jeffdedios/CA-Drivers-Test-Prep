import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: varchar("category").notNull(),
  questionText: text("question_text").notNull(),
  options: jsonb("options").notNull(), // Array of 4 answer options
  correctAnswer: integer("correct_answer").notNull(), // Index 0-3
  explanation: text("explanation").notNull(),
  section: varchar("section"), // Which section of handbook
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  questionId: varchar("question_id").notNull().references(() => questions.id),
  isBookmarked: boolean("is_bookmarked").default(false),
  timesAnswered: integer("times_answered").default(0),
  timesCorrect: integer("times_correct").default(0),
  lastAnswered: timestamp("last_answered"),
  markedForReview: boolean("marked_for_review").default(false),
});

export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  mode: varchar("mode").notNull(), // sequential, random, review
  category: varchar("category"), // all, signs, laws, safety, alcohol
  questionsAnswered: integer("questions_answered").default(0),
  correctAnswers: integer("correct_answers").default(0),
  startedAt: timestamp("started_at").default(sql`now()`),
  completedAt: timestamp("completed_at"),
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
