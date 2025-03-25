export class DebugPanel {
    private isVisible: boolean = false;
    private panel: HTMLDivElement;
    private gameInfo: HTMLDivElement;
    private fpsCounter: number = 0;
    private lastTime: number = 0;

    constructor() {
        this.panel = document.createElement('div');
        this.panel.style.cssText = `
            position: fixed;
            right: 0;
            top: 0;
            width: 300px;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            font-family: monospace;
            padding: 15px;
            display: none;
            z-index: 1000;
            overflow-y: auto;
        `;

        this.gameInfo = document.createElement('div');
        this.gameInfo.style.cssText = `
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 1.4;
            white-space: pre-wrap;
            word-break: break-word;
        `;

        this.panel.appendChild(this.gameInfo);
        document.body.appendChild(this.panel);

        // Toggle debug panel with F3 key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F3') {
                this.toggle();
            }
        });
    }

    public toggle(): void {
        this.isVisible = !this.isVisible;
        this.panel.style.display = this.isVisible ? 'block' : 'none';
    }

    public updateFPS(): void {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.fpsCounter = Math.round(1000 / deltaTime);
    }

    public updateGameInfo(info: Record<string, any>): void {
        if (!this.isVisible) return;

        let html = '<h3 style="margin-top: 0; margin-bottom: 15px;">Debug Info</h3>';
        html += `<div style="margin-bottom: 15px;">FPS: ${this.fpsCounter}</div>`;
        
        for (const [key, value] of Object.entries(info)) {
            html += `<div style="margin-bottom: 5px;">${key}: ${value}</div>`;
        }

        this.gameInfo.innerHTML = html;
    }
} 