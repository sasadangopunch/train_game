const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let player;
let defender;
let bullets = [];
let defenderBullets = [];
let score = 0;
let isGameOver = false;

// Player properties
const playerWidth = 50;
const playerHeight = 50;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;
let playerSpeed = 5;

// Defender properties
const defenderWidth = 50;
const defenderHeight = 50;
let defenderX = canvas.width / 2 - defenderWidth / 2;
let defenderY = 10;
let defenderSpeed = 2;

// Bullet properties
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 7;

// Key states
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    ' ': false
};

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
    if (e.key === ' ') {
        shoot();
    }
});

function shoot() {
    bullets.push({
        x: playerX + playerWidth / 2 - bulletWidth / 2,
        y: playerY,
        width: bulletWidth,
        height: bulletHeight
    });
}

function defenderShoot() {
    defenderBullets.push({
        x: defenderX + defenderWidth / 2 - bulletWidth / 2,
        y: defenderY + defenderHeight,
        width: bulletWidth,
        height: bulletHeight
    });
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawDefender() {
    ctx.fillStyle = 'red';
    ctx.fillRect(defenderX, defenderY, defenderWidth, defenderHeight);
}

function drawBullets() {
    ctx.fillStyle = 'green';
    for (const bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function drawDefenderBullets() {
    ctx.fillStyle = 'orange';
    for (const bullet of defenderBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player movement
    if (keys.ArrowLeft && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (keys.ArrowRight && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
    if (keys.ArrowUp && playerY > 0) {
        playerY -= playerSpeed;
    }
    if (keys.ArrowDown && playerY < canvas.height - playerHeight) {
        playerY += playerSpeed;
    }

    // Move bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bulletSpeed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    // Move defender bullets
    for (let i = defenderBullets.length - 1; i >= 0; i--) {
        defenderBullets[i].y += bulletSpeed;
        if (defenderBullets[i].y > canvas.height) {
            defenderBullets.splice(i, 1);
        }
    }
    
    // Defender movement (simple back and forth)
    defenderX += defenderSpeed;
    if (defenderX <= 0 || defenderX >= canvas.width - defenderWidth) {
        defenderSpeed *= -1;
    }


    // Collision detection
    // Player bullets hitting defender
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        if (
            bullet.x < defenderX + defenderWidth &&
            bullet.x + bullet.width > defenderX &&
            bullet.y < defenderY + defenderHeight &&
            bullet.y + bullet.height > defenderY
        ) {
            bullets.splice(i, 1);
            score++;
            // Reset defender
            defenderX = Math.random() * (canvas.width - defenderWidth);
        }
    }

    // Defender bullets hitting player
    for (let i = defenderBullets.length - 1; i >= 0; i--) {
        const bullet = defenderBullets[i];
        if (
            bullet.x < playerX + playerWidth &&
            bullet.x + bullet.width > playerX &&
            bullet.y < playerY + playerHeight &&
            bullet.y + bullet.height > playerY
        ) {
            defenderBullets.splice(i, 1);
            isGameOver = true;
        }
    }

    drawPlayer();
    drawDefender();
    drawBullets();
    drawDefenderBullets();
    drawScore();

    requestAnimationFrame(update);
}

// Defender shooting interval
setInterval(defenderShoot, 1000);

update();
