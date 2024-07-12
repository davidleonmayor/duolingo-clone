import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

// Relationships between "courses" entity other entities
export const courseRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress), // One course can have many user progress
  units: many(units), // One course can have many units
}));

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  // A unit belongs to a course
  courseId: integer("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

// Relationships for the "units" entity with other entities
export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

// Relationships for the "lessons" entity with other entities
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
});

// Relationships for the "challenges" entity with other entities
export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOption),
  challengeProgress: many(challengeProgress),
}));

export const challengeOption = pgTable("challenge_option", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("boolean").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

// Relationships for the "challenge_option" entity with other entities
export const challengeOptionRelations = relations(
  challengeOption,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOption.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

// Relationships for the "challenge_progress" entity with other entities
export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

// Relationships for the "user_progress" entity with other entities
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const userSubscription = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

export type InsertCourses = typeof courses.$inferInsert;
export type SelectCourses = typeof courses.$inferSelect;

export type InsertUnits = typeof units.$inferInsert;
export type SelectUnits = typeof units.$inferSelect;

export type InsertLessons = typeof lessons.$inferInsert;
export type SelectLessons = typeof lessons.$inferSelect;

export type InsertChallenges = typeof challenges.$inferInsert;
export type SelectChallenges = typeof challenges.$inferSelect;

export type InsertChallengeOptions = typeof challengeOption.$inferInsert;
export type SelectChallengeOptions = typeof challengeOption.$inferSelect;

export type InsertChallengeProgress = typeof challengeProgress.$inferInsert;
export type SelectChallengeProgress = typeof challengeProgress.$inferSelect;

export type InsertUserProgress = typeof userProgress.$inferInsert;
export type SelectUserProgress = typeof userProgress.$inferSelect;
