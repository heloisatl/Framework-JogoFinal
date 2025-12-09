class FrameworkJogo {
    constructor(container) {
        this.container = container;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        const attrW = Number(container.getAttribute("width"));
        const attrH = Number(container.getAttribute("height"));
        const useW = (Number.isFinite(attrW) && attrW > 0) ? attrW : container.clientWidth || 600;
        const useH = (Number.isFinite(attrH) && attrH > 0) ? attrH : container.clientHeight || 400;

        this.canvas.width = useW;
        this.canvas.height = useH;

        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";

        container.appendChild(this.canvas);


        this.gameOver = false;


        this.triangulos = [];
        this.pontos = 0;

        this.carregarConfig();
        this.carregarPlayer();
        this.carregarInimigos();
        this.carregarBlocos();

        this.addControls();

        this.restartButtonCreated = false;


        this.iniciarSpawnTriangulos();

        this.loop();
    }

    carregarConfig() {
        const c = this.container.querySelector("config") || this.container.querySelector("[data-type='config']");
        this.dificuldade = c ? (c.getAttribute("dificuldade") || c.dataset.dificuldade) : "Easy";
    }

    carregarPlayer() {
        const p = this.container.querySelector("player") || this.container.querySelector("[data-type='player']");

        if (!p) {
            this.player = { x: 50, y: 50, size: 40, color: "blue", speed: 8 };
            return;
        }
        //adaptei
        const x = Number(p.getAttribute("x") || p.dataset.x) || 50;
        const y = Number(p.getAttribute("y") || p.dataset.y) || 50;
        const size = Number(p.getAttribute("size") || p.dataset.size) || 40;
        const color = p.getAttribute("cor") || p.dataset.cor || "blue";

        this.player = { x, y, size, color, speed: 12 };
    }

    carregarInimigos() {
        this.enemies = [];
        const enemiesHTML = this.container.querySelectorAll("enemy, [data-type='enemy']");

        enemiesHTML.forEach(el => {
            const x = Number(el.getAttribute("x") || el.dataset.x) || 0;
            const y = Number(el.getAttribute("y") || el.dataset.y) || 0;
            const raio = Number(el.getAttribute("raio") || el.dataset.raio) || 10;
            const dx = Number(el.getAttribute("dx") || el.dataset.dx) || 2;
            const dy = Number(el.getAttribute("dy") || el.dataset.dy) || 2;
            const color = el.getAttribute("cor") || el.dataset.cor || "red";

            this.enemies.push({ x, y, radius: raio, dx, dy, color });
        });
    }

    carregarBlocos() {
        this.blocks = [];
        const blocksHTML = this.container.querySelectorAll("obstaculo, [data-type='block'], [data-type='obstaculo']");

        blocksHTML.forEach(el => {
            const x = Number(el.getAttribute("x") || el.dataset.x) || 0;
            const y = Number(el.getAttribute("y") || el.dataset.y) || 0;
            const width = Number(el.getAttribute("largura") || el.dataset.largura || el.dataset.width) || 50;
            const height = Number(el.getAttribute("altura") || el.dataset.altura || el.dataset.height) || 10;
            const color = el.getAttribute("cor") || el.dataset.cor || "black";

            this.blocks.push({ x, y, width, height, color });
        });
    }

    addControls() {
        this._keydownHandler = (event) => {
            const key = event.key;

            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
                event.preventDefault();
            }

            let px = this.player.x;
            let py = this.player.y;

            if (key === "ArrowUp") py -= this.player.speed;
            if (key === "ArrowDown") py += this.player.speed;
            if (key === "ArrowLeft") px -= this.player.speed;
            if (key === "ArrowRight") px += this.player.speed;

            px = Math.max(0, Math.min(px, this.canvas.width - this.player.size));
            py = Math.max(0, Math.min(py, this.canvas.height - this.player.size));

            if (!this.colideBloco(px, py, this.player.size)) {
                this.player.x = px;
                this.player.y = py;
            }
        };

        window.addEventListener("keydown", this._keydownHandler);
    }


    spawnTriangulo() {
        const size = 25;
        const x = Math.random() * (this.canvas.width - size);
        const y = Math.random() * (this.canvas.height - size);

        this.triangulos.push({ x, y, size });
    }

    iniciarSpawnTriangulos() {
        let intervalo = 3000;

        if (this.dificuldade === "Medium") intervalo = 2000;
        if (this.dificuldade === "Hard") intervalo = 1200;

        setInterval(() => {
            if (!this.gameOver) this.spawnTriangulo();
        }, intervalo);
    }

    drawTriangulos() {
        for (let t of this.triangulos) {
            this.ctx.fillStyle = "yellow";
            this.ctx.beginPath();
            this.ctx.moveTo(t.x, t.y + t.size);
            this.ctx.lineTo(t.x + t.size / 2, t.y);
            this.ctx.lineTo(t.x + t.size, t.y + t.size);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    coletarTriangulos() {
        this.triangulos = this.triangulos.filter(t => {
            if (
                this.player.x < t.x + t.size &&
                this.player.x + this.player.size > t.x &&
                this.player.y < t.y + t.size &&
                this.player.y + this.player.size > t.y
            ) {
                this.pontos++;
                return false;
            }
            return true;
        });
    }

    drawPlayer() {
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.size, this.player.size);
    }

    drawEnemies() {
        for (let e of this.enemies) {
            this.ctx.beginPath();
            this.ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = e.color;
            this.ctx.fill();
        }
    }

    drawBlocks() {
        for (let b of this.blocks) {
            this.ctx.fillStyle = b.color;
            this.ctx.fillRect(b.x, b.y, b.width, b.height);
        }
    }

    colideBloco(x, y, size) {
        for (let b of this.blocks) {
            if (
                x < b.x + b.width &&
                x + size > b.x &&
                y < b.y + b.height &&
                y + size > b.y
            ) {
                return true;
            }
        }
        return false;
    }

    moveEnemies() {
        for (let e of this.enemies) {
            e.x += e.dx;
            e.y += e.dy;

            if (e.x + e.radius > this.canvas.width) {
                e.x = this.canvas.width - e.radius;
                e.dx *= -1;
            } else if (e.x - e.radius < 0) {
                e.x = e.radius;
                e.dx *= -1;
            }

            if (e.y + e.radius > this.canvas.height) {
                e.y = this.canvas.height - e.radius;
                e.dy *= -1;
            } else if (e.y - e.radius < 0) {
                e.y = e.radius;
                e.dy *= -1;
            }

            for (let b of this.blocks) {
                const closestX = Math.max(b.x, Math.min(e.x, b.x + b.width));
                const closestY = Math.max(b.y, Math.min(e.y, b.y + b.height));
                const dx = e.x - closestX;
                const dy = e.y - closestY;
                if (Math.sqrt(dx * dx + dy * dy) < e.radius) {
                    e.dx *= -1;
                    e.dy *= -1;
                    e.x += e.dx;
                    e.y += e.dy;
                }
            }
        }
    }

    checkCollision() {
        for (let e of this.enemies) {
            const distX = Math.max(this.player.x, Math.min(e.x, this.player.x + this.player.size));
            const distY = Math.max(this.player.y, Math.min(e.y, this.player.y + this.player.size));
            const dx = e.x - distX;
            const dy = e.y - distY;
            if (Math.sqrt(dx * dx + dy * dy) < e.radius) {
                this.gameOver = true;
                this.criarBotaoReiniciar();
                break;
            }
        }
    }

    criarBotaoReiniciar() {
        if (this.restartButtonCreated) return;
        this.restartButtonCreated = true;

        const btn = document.createElement("button");
        btn.innerText = "Recomeçar";
        btn.classList.add("restart-btn");

        btn.onclick = () => {
            window.removeEventListener("keydown", this._keydownHandler);
            location.reload();
        };

        document.body.appendChild(btn);
    }

    desenhaGameOver() {
        this.ctx.fillStyle = "rgba(0,0,0,0.6)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "48px Arial";
        this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameOver) {
            this.desenhaGameOver();
            return;
        }

        this.moveEnemies();

        this.drawBlocks();
        this.drawPlayer();
        this.drawEnemies();


        this.drawTriangulos();
        this.coletarTriangulos();

        this.checkCollision();

        requestAnimationFrame(() => this.loop());
    }
}
