# Deployment Guide

This document provides instructions for deploying the Linear Equation Solver System to a production environment.

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications.

1. **Sign up** or **log in** to [Vercel](https://vercel.com)
2. Connect your GitHub/GitLab/Bitbucket account
3. Import this repository
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: A secure random string for authentication
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
5. Deploy

### 2. Self-Hosted Deployment

#### Prerequisites
- Node.js 18+ installed
- Access to a MongoDB database

#### Steps

1. Clone your repository:
   ```bash
   git clone https://github.com/your-username/etoma-linear-equation-solver-system.git
   cd etoma-linear-equation-solver-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with production values:
   ```
   MONGODB_URI=your_production_mongodb_uri
   NEXTAUTH_SECRET=your_secure_random_string
   NEXTAUTH_URL=https://your-domain.com
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Start the production server:
   ```bash
   npm start
   ```

6. For production deployment, consider using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "equation-solver" -- start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Full URL of your application | Yes |

## Post-Deployment Checklist

- [ ] Verify authentication is working
- [ ] Test equation solving with various inputs
- [ ] Check that history saving and retrieval works
- [ ] Test on different browsers and devices
- [ ] Set up monitoring (optional)
- [ ] Configure backups for your MongoDB database

## Troubleshooting

### Authentication Issues
- Ensure `NEXTAUTH_URL` matches your actual deployment URL
- Check that `NEXTAUTH_SECRET` is properly set

### Database Connection Issues
- Verify MongoDB connection string is correct
- Ensure IP whitelist settings allow connections from your server

### Performance Issues
- Consider implementing database indexing
- Look into Next.js caching strategies
