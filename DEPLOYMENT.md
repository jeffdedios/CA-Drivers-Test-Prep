# Deployment Guide

## DATABASE_URL Configuration for Deployment

This application uses **in-memory storage** (`MemStorage`) and does not require a PostgreSQL database at runtime. However, the `drizzle.config.ts` file requires a `DATABASE_URL` environment variable during the build process.

### For Replit Deployments

To deploy this application, you need to set a dummy `DATABASE_URL` environment variable:

```
DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
```

### Why This Works

1. **Build Time**: The drizzle configuration is only used during build/migration time
2. **Runtime**: The application uses `MemStorage` class which stores all data in memory
3. **No Database Dependency**: The server gracefully handles database connection errors and continues with in-memory storage

### Environment Variables Required

- `DATABASE_URL` - Set to dummy value for build compatibility
- `PORT` - Deployment port (automatically set by Replit)
- `NODE_ENV` - Set to "production" for deployment

### Deployment Steps

1. Set the `DATABASE_URL` environment variable in your deployment configuration:
   ```
   DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
   ```

2. Deploy the application - it will build successfully and run using in-memory storage

3. The application will log: "Database connection not available - using in-memory storage" and continue operating normally

### Architecture Notes

- All question data is seeded from the `MemStorage.seedQuestions()` method
- User progress is stored in memory and will reset on server restart
- No actual database connections are made at runtime
- This approach provides fast performance and zero database costs