# Classic Games Collection

A collection of classic arcade games implemented using TypeScript and HTML5 Canvas, including Pong, Breakout, and Mario.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:9000`

## Games and Controls

### Pong
A two-player tennis-like game where players bounce a ball back and forth.

Controls:
- Left player (Player 1):
  - Move up: `W` key
  - Move down: `S` key
- Right player (Player 2):
  - Move up: `↑` Arrow key
  - Move down: `↓` Arrow key

### Breakout
A single-player game where you control a paddle to bounce a ball and break bricks.

Controls:
- Move paddle left: `←` Left Arrow key
- Move paddle right: `→` Right Arrow key

Features:
- Multiple lives
- Score tracking
- Increasing difficulty as you break more bricks
- Dynamic ball physics based on where the ball hits the paddle

### Mario
A platformer game featuring the classic Mario-style gameplay.

Controls:
- Move left: `←` Left Arrow key
- Move right: `→` Right Arrow key
- Jump: `↑` Up Arrow key or `Space` bar

## Development

To build the games for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

- Smooth animations with delta-time based movement
- Responsive controls
- Collision detection
- Score tracking
- Modern TypeScript implementation
- Canvas-based rendering 