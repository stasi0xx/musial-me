import { pgTable, serial, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  kicker: text('kicker').notNull().default(''),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull().default(''),
  content: text('content').notNull().default(''),
  href: text('href').notNull().default(''),
  date: text('date'),
  image: text('image').notNull().default(''),
  tags: text('tags').array().notNull().default([]),
  isPublished: boolean('is_published').notNull().default(false),
  isFeatured: boolean('is_featured').notNull().default(false),
  showInBlogSection: boolean('show_in_blog_section').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const initiatives = pgTable('initiatives', {
  id: serial('id').primaryKey(),
  sortOrder: integer('sort_order').notNull().default(0),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  metaType: text('meta_type').notNull().default(''),
  metaYear: text('meta_year').notNull().default(''),
  metaCategory: text('meta_category').notNull().default(''),
  goal: text('goal').notNull().default(''),
  actions: text('actions').notNull().default(''),
  effect: text('effect').notNull().default(''),
  image: text('image').notNull().default(''),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const aboutSection = pgTable('about_section', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().default(''),
  role: text('role').notNull().default(''),
  bio: text('bio').notNull().default(''),
  image: text('image').notNull().default(''),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type Initiative = typeof initiatives.$inferSelect;
export type NewInitiative = typeof initiatives.$inferInsert;
export type AboutSection = typeof aboutSection.$inferSelect;
