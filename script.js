window.addEventListener('load',function(){
    //canvas setup

    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    
    class InputHandler {
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', e => {
                if( ( (e.key === 'ArrowUp') || 
                        (e.key ==='ArrowDown') || 
                        (e.key ==='w') || 
                        (e.key ==='s')) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                } else if(e.key === 'e') this.game.player1.shootTop(3);
                else if(e.key === ' ') this.game.player2.shootTop(-3);
            });
            window.addEventListener('keyup', e =>{
                if (this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });
        }
    }
    class Projectile {
        constructor(game, x, y, speed) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = speed;
            this.markedForDeletion = false;
        }
        update(){
            if(this.speed > 0){
                this.x += this.speed;
                if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
            }
            else {
                this.x += this.speed;
                if (this.x < this.game.width * 0.2) this.markedForDeletion = true;  
            }

        }
        draw(context){
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    class Particle {

    }
    class Player {
        constructor(game, x, y){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = x;
            this.y = y;
            this.speedY = 0;
            this.maxSpeed = 1;
            this.projectiles =[];
            this.ammo = 20;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.maxAmmo = 30;
            this.score = 0;
            this.winningScore = 10;
        }
        update(key1, key2){
            if( this.game.keys.includes(key1)) this.speedY = -this.maxSpeed;
            else if( this.game.keys.includes(key2)) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;
            //projectiles
            this.projectiles.forEach(projectile =>{
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion );
        }
        draw(context){
            context.fillStyle = 'black';
            context.fillRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile =>{
                projectile.draw(context);
            });
        }
        shootTop(speed){
            if (this.ammo > 0 && speed > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, speed));
                this.ammo--;
            }
            else if (this.ammo > 0 && speed < 0){
                this.projectiles.push(new Projectile(this.game, this.x + 20, this.y + 30, speed));
                this.ammo--;
            }
        }
    }
    class Enemy {
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 -0.5;
            this.markedForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
        }
        update(){
            this.x += this.speedX;
            if (this.x + this.width < 0) this.markedForDeletion = true;
        }
        draw(context){
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y, this.width, this.height);
            context.fillStyle = 'black';
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }
    }
    class Liad extends Enemy {
        constructor(game){
            super(game);
            this.width = 228 * 0.2;
            this.height = 169 * 0.2;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
        }
    }

    class Layer {

    }
    class Background {

    }
    class UI {
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'white';
        }
        draw(context){
            context.fillStyle = this.color;
            for (let i = 0; i < this.game.player1.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
        }
        
    }
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player1 = new Player(this, 20, 100);
            this.player2 = new Player(this, canvas.width - 140, 100);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.enemies = []
            this.keys = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.gameOver = false;
        }
        update(deltaTime){
            this.player1.update('w', 's');
            this.player2.update('ArrowUp', 'ArrowDown');
            if(this.player1.ammoTimer > this.player1.ammoInterval && this.player1.ammo < this.player1.maxAmmo){
                this.player1.ammo ++;
                this.player1.ammoTimer = 0;
            } else { 
                this.player1.ammoTimer += deltaTime;
            }
            if(this.player2.ammoTimer > this.player2.ammoInterval && this.player2.ammo < this.player2.maxAmmo){
                this.player2.ammo ++;
                this.player2.ammoTimer = 0;
            } else { 
                this.player2.ammoTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player1, enemy)){
                    enemy.markedForDeletion = true;
                }
                this.player1.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            this.player1.score += enemy.score;
                        }
                    }
                });
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context){
            this.player1.draw(context);
            this.player2.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        }
        addEnemy(){
            this.enemies.push(new Liad(this));
            console.log(this.enemies);
        }
        checkCollision(rect1, rect2){
            return (rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.y + rect1.height > rect2.y);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    //animation loops
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});