const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');


let ball = {
    x: canvas.width / 2,
    y: canvas.height -30,
    radius: 10,
    dx: 2,
    dy: -2
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI *2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath()
}

function updateFrames() {
    if (ball.x + ball.dx > canvas.width || ball.x + ball.dx < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy > canvas.height || ball.y + ball.dy < 0){
        ball.dy = -ball.dy;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateFrames();
    drawBall();
    requestAnimationFrame(gameLoop);
}

gameLoop();