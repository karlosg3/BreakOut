const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


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

//Aqui actualizamos los valores de los objetos
function updateFrames() {
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
            alert("GAME OVER, SCORE: " + score.last);
            document.location.reload();
        }
    }

    //Movimiento del Paddle
    //Incluye colision con las paredes
    if (paddle.rightPressed && paddle.position < canvas.width - paddle.w) {
        paddle.position += 7;
    } else if (paddle.leftPressed && paddle.position > 0) {
        paddle.position -= 7;
    }

    // Movimiento de la Pelota
    ball.x += ball.dx;
    ball.y += ball.dy;
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
function gameLoop() {
    //Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Actualización y Colisiones
    updateFrames();
    brickCollision();
    //Dibujo de los elementos
    drawBricks();
    drawPaddle();
    drawBall();
    drawScore();
    
    requestAnimationFrame(gameLoop);
}

gameLoop();