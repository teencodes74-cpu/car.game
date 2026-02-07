const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let car = { x: 200, y: 250, width: 10, height: 15, speed: 0, angle: 0 }; // Smaller for pixel feel
let obstacles = [];
let score = 0;
let gameRunning = true;
let roadLines = []; // For dashed road lines

// Initialize road lines
for (let i = 0; i < canvas.height; i += 20) {
    roadLines.push({ y: i, visible: true });
}

// Draw functions
function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = '#ff0000'; // Bright red for retro
    ctx.fillRect(-car.width/2, -car.height/2, car.width, car.height);
    ctx.restore();
}

function drawRoad() {
    // Draw grass sides
    ctx.fillStyle = '#00aa00'; // Green
    ctx.fillRect(0, 0, 50, canvas.height);
    ctx.fillRect(canvas.width - 50, 0, 50, canvas.height);
    
    // Draw road
    ctx.fillStyle = '#444444'; // Gray asphalt
    ctx.fillRect(50, 0, canvas.width - 100, canvas.height);
    
    // Draw dashed lines
    ctx.fillStyle = '#ffffff'; // White
    roadLines.forEach(line => {
        if (line.visible) {
            ctx.fillRect(canvas.width / 2 - 2, line.y, 4, 10);
        }
        line.y += 2; // Scroll lines
        if (line.y > canvas.height) line.y = -10;
        line.visible = !line.visible; // Alternate dashes
    });
}

function drawObstacles() {
    ctx.fillStyle = '#000000'; // Black blocks
    obstacles.forEach(ob => ctx.fillRect(ob.x, ob.y, ob.width, ob.height));
}

function drawScore() {
    ctx.fillStyle = '#ffffff'; // White text
    ctx.font = '16px monospace'; // Pixel-like font
    ctx.fillText(`SCORE: ${score}`, 10, 20);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update car
    car.x += Math.sin(car.angle) * car.speed;
    car.y -= Math.cos(car.angle) * car.speed;
    car.speed *= 0.98; // Friction

    // Keep car on road
    if (car.x < 60) car.x = 60;
    if (car.x > canvas.width - 60) car.x = canvas.width - 60;

    // Generate obstacles
    if (Math.random() < 0.015) { // Slower spawn for retro pace
        obstacles.push({ x: 50 + Math.random() * (canvas.width - 150), y: 0, width: 10, height: 10 });
    }

    // Move obstacles
    obstacles.forEach(ob => ob.y += 2);
    obstacles = obstacles.filter(ob => ob.y < canvas.height);

    // Collision detection
    obstacles.forEach(ob => {
        if (car.x < ob.x + ob.width && car.x + car.width > ob.x &&
            car.y < ob.y + ob.height && car.y + car.height > ob.y) {
            gameRunning = false;
            alert(`GAME OVER! SCORE: ${score}`);
        }
    });

    // Draw everything
    drawRoad();
    drawCar();
    drawObstacles();
    drawScore();

    score++;
    requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') car.angle -= 0.1;
    if (e.key === 'ArrowRight') car.angle += 0.1;
    if (e.key === 'ArrowUp') car.speed += 0.5;
    if (e.key === 'ArrowDown') car.speed -= 0.5;
});

gameLoop();