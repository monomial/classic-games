import { Pong } from './pong';
import { Breakout } from './breakout';
import { MarioGame } from './marioGame';
import { DebugPanel } from './debugPanel';

// Start the game when the page loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const gameSelection = document.getElementById('gameSelection') as HTMLDivElement;
    const pongButton = document.getElementById('pongButton') as HTMLButtonElement;
    const breakoutButton = document.getElementById('breakoutButton') as HTMLButtonElement;
    const marioButton = document.getElementById('marioButton') as HTMLButtonElement;

    // Initialize debug panel
    const debugPanel = new DebugPanel();

    pongButton.addEventListener('click', () => {
        gameSelection.style.display = 'none';
        canvas.style.display = 'block';
        new Pong(debugPanel);
    });

    breakoutButton.addEventListener('click', () => {
        gameSelection.style.display = 'none';
        canvas.style.display = 'block';
        new Breakout(canvas, debugPanel);
    });

    marioButton.addEventListener('click', () => {
        gameSelection.style.display = 'none';
        canvas.style.display = 'block';
        new MarioGame(canvas, debugPanel).start();
    });
}); 