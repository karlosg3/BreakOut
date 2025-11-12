const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


// En esta área se definen los objetos
let ball = {
    x: canvas.width / 2,
    y: canvas.height -30,
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

//Solucion a paradoja temporal
paddle.position = (canvas.width - paddle.w) /2;

// En esta área se dibujan los objetos
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI *2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath()
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.position, canvas.height-paddle.h, paddle.w, paddle.h);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
}

//Aqui actualizamos los valores de los objetos
function updateFrames() {
    //Colision con Paredes
    if (ball.x + ball.dx > canvas.width || ball.x + ball.dx < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy > canvas.height || ball.y + ball.dy < 0){
        ball.dy = -ball.dy;
    }

    //Movimiento del Paddle
    //Incluye colision con las paredes
    if (paddle.rightPressed && paddle.position < canvas.width - paddle.w){
        paddle.position += 7;
    } else if (paddle.leftPressed && paddle.position > 0){
        paddle.position -= 7;
    }

    // Movimiento de la Pelota
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Aqui se encuantran las funciones de controles
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        paddle.rightPressed = true;
    } else if (e.keyCode == 37) {
        paddle.leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        paddle.rightPressed = false;
    } else if (e.keyCode == 37) {
        paddle.leftPressed = false;
    }
}

// Aquí se reproduce toa la sentencia del juego
function gameLoop() {
    //Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateFrames();
    drawPaddle();
    drawBall();
    requestAnimationFrame(gameLoop);
}

gameLoop();