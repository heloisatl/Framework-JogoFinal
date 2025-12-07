const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d'); 

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let square = {
    x: 200,
    y: 200,
    size: 50,
    color: "blue",
    speed: 18
};

let enemies = [];
let enemyCount = 5;
let gameOver = false;

for (let i = 0; i < enemyCount; i++) {
    enemies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 20,
        dx: (Math.random() * 4) + 1,
        dy: (Math.random() * 4) + 1,
        color: "red"
    });
}

function drawSquare(){
    ctx.fillStyle = square.color;
    ctx.fillRect(square.x, square.y, square.size, square.size);
}

function drawEnemies(){
    for(let enemy of enemies){
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();
        ctx.closePath();
    }
}

function moveEnemies(){
    for(let enemy of enemies){
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;

        if(enemy.x + enemy.radius > canvas.width || enemy.x - enemy.radius < 0){
            enemy.dx *= -1;
        }

        if(enemy.y + enemy.radius > canvas.height || enemy.y - enemy.radius < 0){
            enemy.dy *= -1;
        }
    }
}


function checkCollision(){
    for(let enemy of enemies){
        let distX = Math.max(square.x, Math.min(enemy.x, square.x + square.size));
        let distY = Math.max(square.y, Math.min(enemy.y, square.y + square.size));

        let dx = enemy.x - distX;
        let dy = enemy.y - distY;

        if(Math.sqrt(dx * dx + dy * dy) < enemy.radius){
            gameOver = true;
        }
    }
}

function moveSquare(event){
    const key = event.key;

    if(key === "ArrowUp" && square.y > 0){
        square.y -= square.speed;
    }
    else if(key === "ArrowDown" && square.y + square.size < canvas.height){
        square.y += square.speed;
    }
    else if (key === "ArrowLeft"  && square.x > 0) {
        square.x -= square.speed;
    }
    else if (key === "ArrowRight"  && square.x + square.size < canvas.width) {
        square.x += square.speed;
    }
}

window.addEventListener('keydown', moveSquare);

function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(gameOver){
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", 300, 450);
        return;
    }

    drawSquare();
    drawEnemies();
    moveEnemies();
    checkCollision();

    requestAnimationFrame(loop);
}

loop();
