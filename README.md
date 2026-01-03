# Drop Numbers - 3D Math Tetris Game

A 3D browser game similar to Tetris, but instead of blocks, numbers from 1-9 fall down. The goal is to arrange numbers horizontally and vertically so their sum equals a predefined target (5-20).

## Features

- 🎮 3D gameplay using Three.js
- 🔢 Numbers 1-9 fall from the top
- ➕ Sum numbers horizontally and vertically to match target sum
- 🎯 Dynamic target sum (5-20)
- 🎨 Beautiful 3D graphics with lighting and shadows
- 🏆 Score system

## Controls

- **← →** Move left/right
- **↓** Move down faster
- **Space** Drop instantly
- **R** Restart (when game over)
- **Mouse** Rotate camera (drag)
- **Scroll** Zoom in/out

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

### Static Export (Standalone - No Server Required)

The game can be built as a standalone static website that runs without a server:

```bash
npm run build
```

This creates an `out` folder with all static files. You can:

1. **Open directly in browser**: Navigate to the `out` folder and open `index.html` in your browser
2. **Serve with any static file server**: 
   ```bash
   # Using Python
   cd out && python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server out -p 8000
   
   # Using PHP
   cd out && php -S localhost:8000
   ```
3. **Deploy to any static hosting**: Upload the `out` folder to GitHub Pages, Netlify, Vercel, or any static hosting service

### Production Build (With Server)

```bash
npm run build
npm start
```

## Game Rules

1. Numbers (1-9) fall from the top of the grid
2. Arrange them horizontally or vertically
3. When a line (horizontal or vertical) sums to the target number, it clears
4. Game ends when numbers reach the top
5. Score increases with each cleared line

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from command line**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

3. **Or deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and deploy

4. **Or use Vercel Dashboard**:
   - Connect your GitHub account
   - Import the repository
   - Vercel will automatically configure everything

The game will be live at `https://your-project-name.vercel.app`

### Deploy to Other Platforms

Since this is a static export, you can deploy to:
- **Netlify**: Drag and drop the `out` folder or connect via Git
- **GitHub Pages**: Upload the `out` folder contents
- **Any static hosting**: Upload the `out` folder

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Three.js
- React Three Fiber
- Tailwind CSS

