import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

/**
 * Users table - stores user authentication and profile data
 */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Sessions table - stores user sessions for authentication
 */
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  sessionToken: text('session_token').notNull().unique(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

/**
 * Accounts table - stores OAuth account connections
 */
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: timestamp('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

/**
 * Verification tokens table - for email verification
 */
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
});

/**
 * Chat sessions table - stores chat conversation metadata
 */
export const chatSessions = pgTable('chat_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  provider: text('provider'), // 'google', 'openai', 'anthropic', 'hf'
  model: text('model'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Messages table - stores individual chat messages
 */
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(),
  name: text('name'),
  toolCalls: text('tool_calls'), // JSON array of tool calls
  toolResults: text('tool_results'), // JSON array of tool results
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Files table - stores uploaded files and AI-generated assets
 */
export const files = pgTable('files', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  key: text('key').notNull(), // Vercel Blob key
  name: text('name'),
  type: text('type'), // 'image', 'document', 'audio', 'video'
  size: text('size'),
  createdAt: timestamp('created_at').defaultNow(),
});

