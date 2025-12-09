class EnemyDodgeGame {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        const mode = this.canvas.getAttribute("mode") || "Easy";
        const collectMode = this.canvas.getAttribute("collect") || "Easy";

        this.settings = this.getDifficultySettings(mode);
        this.collectSettings = this.getcollectettings(collectMode);

        this.square = {
            x: 200,
            y: 200,
            size: 50,
            color: "blue",
            speed: 20
        };

        this.enemies = [];
        this.collect = [];
        this.points = 0;

        this.gameOver = false;
        this.restartBtn = null;

        this.createEnemies();
        this.createcollect();
        this.addControls();
        this.loop();
    }

    getDifficultySettings(mode) {
        const modes = {
            Easy: { enemyCount: 5, enemySpeedMin: 1, enemySpeedMax: 3 },
            Medium: { enemyCount: 13, enemySpeedMin: 2, enemySpeedMax: 5 },
            Hard: { enemyCount: 20, enemySpeedMin: 3, enemySpeedMax: 7 }
        };
        return modes[mode] || modes.Easy;
    }

    getcollectettings(mode) {
        const modes = {
            Easy: { count: 5, respawnTime: 1000 },
            Medium: { count: 6, respawnTime: 2000 },
            Hard: { count: 2, respawnTime: 5000 }
        };
        return modes[mode] || modes.Easy;
    }

    createEnemies() {
        for (let i = 0; i < this.settings.enemyCount; i++) {
            this.enemies.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 20,
                dx: (Math.random() * (this.settings.enemySpeedMax - this.settings.enemySpeedMin)) + this.settings.enemySpeedMin,
                dy: (Math.random() * (this.settings.enemySpeedMax - this.settings.enemySpeedMin)) + this.settings.enemySpeedMin,
                color: "red"
            });
        }
    }

    createcollect() {
        for (let i = 0; i < this.collectSettings.count; i++) {
            this.collect.push(this.createTriangle());
        }
    }

    createTriangle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: 25,
            color: "yellow",
            collected: false
        };
    }

    addControls() {
        window.addEventListener("keydown", (event) => {
            if (this.gameOver) return;

            const key = event.key;

            if (key === "ArrowUp" && this.square.y > 0) this.square.y -= this.square.speed;
            else if (key === "ArrowDown" && this.square.y + this.square.size < this.canvas.height) this.square.y += this.square.speed;
            else if (key === "ArrowLeft" && this.square.x > 0) this.square.x -= this.square.speed;
            else if (key === "ArrowRight" && this.square.x + this.square.size < this.canvas.width) this.square.x += this.square.speed;
        });
    }

    drawSquare() {
        this.ctx.fillStyle = this.square.color;
        this.ctx.fillRect(this.square.x, this.square.y, this.square.size, this.square.size);
    }

    drawEnemies() {
        for (let enemy of this.enemies) {
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = enemy.color;
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    drawcollect() {
        for (let item of this.collect) {
            if (item.collected) continue;

            this.ctx.beginPath();
            this.ctx.moveTo(item.x, item.y - item.size);
            this.ctx.lineTo(item.x - item.size, item.y + item.size);
            this.ctx.lineTo(item.x + item.size, item.y + item.size);
            this.ctx.closePath();

            this.ctx.fillStyle = item.color;
            this.ctx.fill();
        }
    }

    moveEnemies() {
        for (let enemy of this.enemies) {
            enemy.x += enemy.dx;
            enemy.y += enemy.dy;

            if (enemy.x + enemy.radius > this.canvas.width || enemy.x - enemy.radius < 0) {
                enemy.dx *= -1;
            }

            if (enemy.y + enemy.radius > this.canvas.height || enemy.y - enemy.radius < 0) {
                enemy.dy *= -1;
            }
        }
    }

    checkCollision() {
        for (let enemy of this.enemies) {
            let distX = Math.max(this.square.x, Math.min(enemy.x, this.square.x + this.square.size));
            let distY = Math.max(this.square.y, Math.min(enemy.y, this.square.y + this.square.size));

            let dx = enemy.x - distX;
            let dy = enemy.y - distY;

            if (Math.sqrt(dx * dx + dy * dy) < enemy.radius) {
                this.gameOver = true;
                this.showRestartButton();
            }
        }
    }

    checkCollectibleCollision() {
        for (let item of this.collect) {
            if (item.collected) continue;

            let insideX = this.square.x < item.x + item.size &&
                this.square.x + this.square.size > item.x - item.size;

            let insideY = this.square.y < item.y + item.size &&
                this.square.y + this.square.size > item.y - item.size;

            if (insideX && insideY) {
                item.collected = true;
                this.points++;

                setTimeout(() => {
                    Object.assign(item, this.createTriangle());
                }, this.collectSettings.respawnTime);
            }
        }
    }

    showRestartButton() {
        this.restartBtn = document.createElement("button");
        this.restartBtn.innerText = "Recomeçar";
        this.restartBtn.className = "restart-btn";
        document.body.appendChild(this.restartBtn);

        this.restartBtn.addEventListener("click", () => {
            this.restartBtn.remove();
            new EnemyDodgeGame(this.canvasId);
        });
    }

    drawPoints() {
        this.ctx.fillStyle = "black";
        this.ctx.font = "28px Arial";
        this.ctx.fillText("Pontos: " + this.points, 20, 40);
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameOver) {
            this.ctx.fillStyle = "black";
            this.ctx.font = "40px Arial";
            this.ctx.fillText("GAME OVER", this.canvas.width / 2 - 120, this.canvas.height / 2);
            return;
        }

        this.drawSquare();
        this.drawEnemies();
        this.drawcollect();
        this.drawPoints();

        this.moveEnemies();
        this.checkCollision();
        this.checkCollectibleCollision();

        requestAnimationFrame(() => this.loop());
    }
}
