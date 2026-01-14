# GitHub Pages Deployment Setup

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Configure Repository Name**:
   - If your repository name is different from "html5-canvas", update the `base` path in `vite.config.js`:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

3. **Deploy**:
   - Push your changes to the `main` branch
   - GitHub Actions will automatically build and deploy your app
   - Your site will be available at: `https://Sunilsolankiji.github.io/html5-canvas/`

## Manual Deployment

You can also trigger a manual deployment by:
- Going to the Actions tab in your GitHub repository
- Selecting the "Deploy to GitHub Pages" workflow
- Clicking "Run workflow"

## Local Development

The deployment configuration doesn't affect local development. Continue using:
```bash
npm run dev
```

## Build Locally

To test the production build locally:
```bash
npm run build
npm run preview
```
