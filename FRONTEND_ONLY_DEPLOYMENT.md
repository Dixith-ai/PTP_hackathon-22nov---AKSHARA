# Frontend-Only Deployment Guide

## Overview
The application has been updated to work in **frontend-only mode** without requiring a backend. When API calls fail, the app automatically falls back to mock data stored in the browser.

## How It Works

### Authentication
- **Login**: Users can enter any email/password and will be logged in using mock authentication
- **User Session**: Stored in `localStorage` as `mock-user`
- **No Backend Required**: Login works completely offline

### Data Management
- **API Calls**: All API calls try the backend first, then fall back to mock data if unavailable
- **Mock Data**: Located in `lib/mockData.ts`
- **Local Storage**: User session persists in browser storage

### Features Available in Demo Mode
✅ User login/authentication  
✅ View courses (with sample courses)  
✅ View habits (with sample habits)  
✅ View community posts (with sample posts)  
✅ View streaks and stats  
✅ Create habits (stored in component state)  
✅ Complete habits (visual feedback only)  
✅ Enroll in courses (visual feedback only)  
✅ Record emotions (visual feedback only)  

## Deployment to Vercel

### Steps
1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Frontend-only mode ready"
   git push
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will auto-detect Next.js
   - No environment variables needed for frontend-only mode
   - Deploy!

3. **That's it!** The app will work without any backend setup.

## What Happens

### When Backend is Available
- App tries to use real API endpoints
- If successful, uses real data
- If fails, automatically falls back to mock data

### When Backend is Not Available (Current Setup)
- All API calls fail gracefully
- App uses mock data from `lib/mockData.ts`
- User experience remains smooth
- Toast notifications show "(Demo Mode)" for mock actions

## Mock Data

The following mock data is included:
- **3 Sample Courses**: Web Development, React, Data Structures
- **2 Sample Habits**: Reading, Coding practice
- **2 Sample Community Posts**: Win post, Question post
- **Sample Streaks**: 7-day streak
- **Sample Badges**: 7 Day Streak badge

## Customization

To add more mock data, edit `lib/mockData.ts`:
```typescript
export const mockCourses = [
  // Add your courses here
]
```

## Future: Adding Backend

When you're ready to add the backend:
1. Set up your database (see `DATABASE_SETUP.md`)
2. Add `DATABASE_URL` to Vercel environment variables
3. The app will automatically start using real API endpoints
4. No code changes needed - the fallback system handles it!

## Notes

- All user actions in demo mode are stored in component state (not persisted)
- Page refreshes will reset demo actions (but user session persists)
- This is perfect for showcasing the UI/UX without backend setup
- When backend is added, everything will work seamlessly

