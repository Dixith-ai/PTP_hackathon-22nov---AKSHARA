# Database Setup for Vercel Deployment

## Problem
SQLite doesn't work on Vercel's serverless environment because it requires a persistent file system, which isn't available in serverless functions.

## Solution Options

### Option 1: Turso (Recommended - Easiest)
Turso is a cloud SQLite database that works with your existing schema.

1. **Sign up for Turso** (free tier available):
   - Go to https://turso.tech/
   - Create an account and a new database

2. **Get your database URL**:
   - In Turso dashboard, copy your database URL
   - It will look like: `libsql://your-database-url`

3. **Set environment variable in Vercel**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `DATABASE_URL` = `libsql://your-database-url`
   - Also add your Turso auth token if required

4. **Install Turso Prisma adapter** (if needed):
   ```bash
   npm install @libsql/client
   ```

5. **Push your schema**:
   ```bash
   npx prisma db push
   ```

### Option 2: Vercel Postgres
Switch to PostgreSQL (requires schema changes).

1. **Add Vercel Postgres**:
   - In Vercel dashboard, go to Storage tab
   - Add "Postgres" database
   - Copy the connection string

2. **Update Prisma schema**:
   - Change `provider = "sqlite"` to `provider = "postgresql"`
   - Update `DATABASE_URL` in Vercel environment variables

3. **Migrate your database**:
   ```bash
   npx prisma migrate dev --name init
   ```

### Option 3: Supabase (Free PostgreSQL)
1. **Create Supabase project**:
   - Go to https://supabase.com/
   - Create a new project

2. **Get connection string**:
   - In Supabase dashboard, go to Settings > Database
   - Copy the connection string (use the URI format)

3. **Update Prisma schema**:
   - Change `provider = "sqlite"` to `provider = "postgresql"`
   - Set `DATABASE_URL` in Vercel to your Supabase connection string

4. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

## Quick Fix for Now (Turso)

The easiest solution that requires NO schema changes:

1. Sign up at https://turso.tech/
2. Create a database
3. Copy the `libsql://` URL
4. Add it as `DATABASE_URL` in Vercel environment variables
5. Redeploy

Your existing SQLite schema will work without any changes!

## After Setting Up

1. Make sure `DATABASE_URL` is set in Vercel environment variables
2. Redeploy your application
3. Test the login functionality

## Local Development

For local development, create a `.env` file:
```
DATABASE_URL="file:./prisma/dev.db"
```

