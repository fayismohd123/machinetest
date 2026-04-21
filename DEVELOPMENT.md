# Development Guide

## Project Setup

### Prerequisites
- Node.js v16 or higher
- npm v7 or higher
- Git
- Code Editor (VS Code recommended)

### Installation
```bash
npm install
```

## Development Server

Start the dev server with hot module replacement:
```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

## Project Architecture

### Component Structure

```
App (Main component)
├── AuthProvider (Context for auth state)
└── AppContent
    ├── Login (if not authenticated)
    └── Dashboard (if authenticated)
```

### Data Flow

1. **Login Component**
   - User enters phone number
   - Calls `preAuth()` from AuthContext
   - Displays hospital selection
   - User enters password
   - Calls `login()` from AuthContext
   - Token stored, redirects to Dashboard

2. **Dashboard Component**
   - Reads user data from AuthContext
   - Displays statistics and recent admissions
   - Logout clears auth state and redirects to Login

### State Management

Uses React Context API for authentication state:
- `AuthContext`: Provides auth state and functions
- `AuthProvider`: Wraps the app with auth state
- `useAuth()`: Custom hook to access auth context

## Code Style Guidelines

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` type
- Use `const` for declarations

### React
- Use functional components with hooks
- Keep components focused and single-responsibility
- Extract reusable components
- Use descriptive component names

### CSS
- Use BEM naming conventions
- Mobile-first approach
- Custom properties for themes
- Avoid inline styles

### Example Component Structure
```tsx
import React, { useState } from 'react';
import './Component.css';

interface ComponentProps {
  title: string;
  onAction: () => void;
}

const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  const [state, setState] = useState('');

  const handleClick = () => {
    onAction();
  };

  return (
    <div className="component">
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};

export default Component;
```

## API Integration

### Adding New API Calls

1. **Update types.ts** with new interfaces:
```tsx
export interface NewData {
  id: number;
  name: string;
}
```

2. **Add to api.ts**:
```tsx
export const fetchNewData = async (): Promise<NewData[]> => {
  try {
    const response = await apiClient.get<NewData[]>('/endpoint');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};
```

3. **Use in component**:
```tsx
const [data, setData] = useState<NewData[]>([]);

useEffect(() => {
  fetchNewData().then(setData).catch(console.error);
}, []);
```

## Testing Guidelines

### Manual Testing Checklist

**Login Flow:**
- [ ] Enter valid phone number
- [ ] Hospital list displays
- [ ] Can select hospital
- [ ] Can enter password
- [ ] Login successful with valid credentials
- [ ] Login fails with invalid password
- [ ] Error messages display correctly

**Dashboard:**
- [ ] Statistics display correctly
- [ ] Recent admissions table shows data
- [ ] All buttons are clickable
- [ ] Responsive on mobile/tablet
- [ ] Logout works and redirects to login

**API Integration:**
- [ ] PreAuthentication API called with correct params
- [ ] UserLogin API called with correct params
- [ ] Error handling works for API failures
- [ ] Network errors handled gracefully

## Debugging Tips

### Browser DevTools
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Use Sources tab to set breakpoints

### Debug Logs
```tsx
console.log('Variable:', variable);
console.error('Error:', error);
console.table(arrayOfObjects);
```

### React DevTools
- Install React DevTools extension
- Inspect component hierarchy
- Track component re-renders
- View component props and state

## Performance Optimization

### Current Optimizations
- Code splitting with Vite
- Lazy component loading potential
- Minimize API calls
- Efficient CSS selectors

### Potential Improvements
- Add React.memo for components
- Implement useMemo for expensive computations
- Code splitting for routes
- Image optimization

## Building & Deploying

### Local Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## Troubleshooting Development

### Port Already in Use
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Module Not Found Errors
- Check import paths
- Ensure file exists
- Verify TypeScript paths in tsconfig.json

### CORS Errors
- Check API server CORS configuration
- Verify API endpoint URL
- Add debug logs to see actual requests

### Build Errors
- Run `npm install` to ensure all dependencies
- Check TypeScript errors: `npx tsc --noEmit`
- Clear node_modules and reinstall if needed

## Git Workflow

### Create Feature Branch
```bash
git checkout -b feature/feature-name
```

### Commit Changes
```bash
git add .
git commit -m "feat: Add feature description"
```

### Push to Remote
```bash
git push origin feature/feature-name
```

### Merge to Main
```bash
git checkout main
git merge feature/feature-name
```

## Code Review Checklist

Before submitting PR:
- [ ] Code follows style guidelines
- [ ] All functions have JSDoc comments
- [ ] No console.log statements left
- [ ] Handled all error cases
- [ ] Tested on multiple browsers
- [ ] Responsive design verified
- [ ] No TypeScript errors
- [ ] No console errors

## Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [MDN Web Docs](https://developer.mozilla.org/)

## Contributing

1. Create feature branch
2. Make changes and test locally
3. Commit with clear messages
4. Push and create pull request
5. Address review comments
6. Merge when approved

## Performance Benchmarks

Target metrics:
- Page load: < 2 seconds
- API response: < 500ms
- Interaction response: < 100ms
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
