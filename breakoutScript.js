const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');

//Optimización de frames
let lastTime = 0;
const TARGET_FPS = 60;
const TARGET_FRAMETIME_MS = 1000 / TARGET_FPS;

//Listeners para controles del paddle
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);


// En esta área se definen los objetos
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 4,
    dy: -4
}

let paddle = {
    h: 10,
    w: 75,
    position: 0,
    rightPressed: false,
    leftPressed: false
}

let brick = {
    rows: 3,
    columns: 5,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30
}

let score = {
    last: 0
}

let player = {
    name: "Player1",
    lives: 3
}

var bricks = [];
for (c = 0; c < brick.columns; c++) {
    bricks[c] = [];
    for (r = 0; r < brick.rows; r++) {
        let brickX = (c * (brick.width + brick.padding)) + brick.offsetLeft;
        let brickY = (r * (brick.height + brick.padding)) + brick.offsetTop;
        bricks[c][r] = { x: brickX, y: brickY, status: 1 };
    }
}

//Solucion a paradoja temporal
paddle.position = (canvas.width - paddle.w) / 2;

// En esta área se dibujan los objetos
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath()
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.position, canvas.height - paddle.h, paddle.w, paddle.h);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
}

function drawBricks() {
    for (c = 0; c < brick.columns; c++) {
        for (r = 0; r < brick.rows; r++) {
            if (bricks[c][r].status == 1) {
                let b = bricks[c][r];
                ctx.beginPath();
                ctx.rect(b.x, b.y, brick.width, brick.height);
                ctx.fillStyle = "#dd0000ff"
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0f8d0cff"
    ctx.fillText("Score: " + score.last, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0f8d0cff";
    ctx.fillText("Lives: " + player.lives, canvas.width - 65, 20);
}

//Aqui actualizamos los valores de los objetos
function updateFrames(dt) {
    //Colision con Paredes
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    //Colision para perder
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.position && ball.x < paddle.position + paddle.w) {
            ball.dy = -ball.dy;
        } else {
            player.lives--;
            if (!player.lives) {
                alert("GAME OVER, SCORE: " + score.last);
                document.location.reload();
            } else {
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 4;
                ball.dy = -4;
                paddle.position = (canvas.width - paddle.w) / 2;
            }
        }
    }

    //Movimiento del Paddle
    //Incluye colision con las paredes
    if (paddle.rightPressed && paddle.position < canvas.width - paddle.w) {
        paddle.position += 7 * dt;
    } else if (paddle.leftPressed && paddle.position > 0) {
        paddle.position -= 7 * dt;
    }

    // Movimiento de la Pelota
    ball.x += ball.dx * dt;
    ball.y += ball.dy * dt;
}

// Aqui se encuantran las funciones de controles
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        paddle.rightPressed = true;
    } else if (e.keyCode == 37) {
        paddle.leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        paddle.rightPressed = false;
    } else if (e.keyCode == 37) {
        paddle.leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.position = relativeX - paddle.w / 2;
    }
}

function brickCollision() {
    for (c = 0 ; c < brick.columns; c++) {
        for (r = 0; r < brick.rows; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (ball.x > b.x && ball.x < b.x + brick.width && ball.y > b.y && ball.y < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score.last++;
                    if (score.last == brick.columns * brick.rows) {
                        alert("YOU WIN, CONGRATS");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Aquí se reproduce toa la sentencia del juego
function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);
    //Optimizacion de frames
    if (!lastTime || currentTime === undefined) {
        lastTime = currentTime;
        return;
    }

    const deltaTime_ms = currentTime - lastTime;
    lastTime = currentTime;
    const deltaMultiplier = deltaTime_ms / TARGET_FRAMETIME_MS;

    //Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Actualización y Colisiones
    updateFrames(deltaMultiplier);
    brickCollision();
    //Dibujo de los elementos
    drawLives();
    drawBricks();
    drawPaddle();
    drawBall();
    drawScore();
    
    
}

gameLoop();