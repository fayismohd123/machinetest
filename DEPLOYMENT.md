# Deployment Guide

## Local Development

### Quick Start
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## Production Build

### Building for Production
```bash
npm run build
```

This will create an optimized build in the `dist/` directory.

### What's Included in the Build
- Minified JavaScript and CSS
- Tree-shaken dependencies (only used code included)
- Optimized assets
- Source maps (for debugging if needed)

## Deployment Options

### 1. Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 2. Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages
```bash
# Update vite.config.ts with:
# base: '/repository-name/'

# Deploy
npm run build
# Push dist/ folder to gh-pages branch
```

### 4. Traditional Server (Node.js)
```bash
# Build
npm run build

# Serve static files with any web server
# Example with http-server:
npm install -g http-server
http-server dist
```

### 5. Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t grapes-hms .
docker run -p 80:80 grapes-hms
```

## Environment Variables for Production

Create a `.env.production` file:
```env
VITE_API_BASE_URL=http://machinetest.grapesonline.net/api
VITE_APP_NAME=Grapes HMS
```

## Performance Optimization

### Pre-deployment Checklist
- [ ] Run `npm run build` and verify no errors
- [ ] Test on `dist/` build locally
- [ ] Verify API endpoints are correct
- [ ] Check browser console for errors
- [ ] Test authentication flow completely
- [ ] Test on multiple devices/browsers
- [ ] Verify CORS is configured on API server

### Optimization Tips
1. **Enable GZIP compression** on your server
2. **Set proper cache headers** for static assets
3. **Use CDN** for faster asset delivery
4. **Enable Brotli compression** for modern browsers
5. **Minify images** before deployment

## SSL/HTTPS

For production:
- Always use HTTPS
- Install SSL certificate
- Configure your server to redirect HTTP to HTTPS
- Consider using Let's Encrypt for free certificates

## API Considerations

### CORS Configuration
If deploying on a different domain than the API:
1. Ensure API allows CORS from your domain
2. Configure proper headers on API server
3. Handle preflight requests

### API Base URL
Update the API base URL based on environment:
- Development: `http://machinetest.grapesonline.net/api`
- Production: Update with production API endpoint if different

## Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics or Mixpanel
- **Performance**: Lighthouse CI
- **Uptime Monitoring**: UptimeRobot

## Rolling Updates

For zero-downtime updates:
1. Build new version
2. Deploy to staging environment
3. Test thoroughly
4. Use blue-green deployment strategy
5. Gradually roll out to production

## Troubleshooting Deployment

### Build Fails
- Check Node.js version: `node --version` (should be v16+)
- Clear cache: `npm cache clean --force`
- Reinstall: `rm node_modules package-lock.json && npm install`

### Blank Page on Load
- Check browser console for errors
- Verify API endpoint accessibility
- Check base URL in production build
- Ensure JavaScript is enabled

### API Connection Issues
- Verify API endpoint is reachable
- Check CORS configuration
- Verify authentication token storage
- Check network tab in browser DevTools

## Backup & Recovery

1. **Version Control**: Use Git branches for different environments
2. **Database Backups**: If using backend with database
3. **Configuration Backups**: Backup environment files
4. **Automated Backups**: Set up with your hosting provider

## Security Hardening

1. **Remove sensitive data** from codebase
2. **Use environment variables** for secrets
3. **Enable security headers** (CSP, X-Frame-Options, etc.)
4. **Regular dependency updates**: `npm outdated` and `npm update`
5. **Security audit**: `npm audit`
6. **Keep Node.js updated**

## Regular Maintenance

- Monthly: Update dependencies
- Monthly: Check for security vulnerabilities
- Monthly: Review logs and error tracking
- Quarterly: Performance optimization
- Quarterly: Browser compatibility testing
