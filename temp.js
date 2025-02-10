
function startGame() {
    if (selectedCharacters.length !== 2) {  
        alert("Please select a character first!");
        return;
    }

    // Hide character selection and show game canvas
    document.querySelector('.character-container').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    document.getElementById('canvas1').style.display = 'block';
    if (gameStarted) return; 
    gameStarted = true; 
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
        constructor(game, x, y, speed, isEnemy) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.isEnemy = isEnemy;
            this.speed = speed;
            this.markedForDeletion = false;
            if (isEnemy) {
                this.image = document.getElementById('keva');
                this.width = 50;
                this.height = 70;
            }
            else {
                this.image = document.getElementById('ptor');
                this.width = 37;
                this.height = 52;
            }
            if (isEnemy) this.y = Math.random() * this.game.height - this.height;
            if (this.y < 0) this.y = -this.height;
            else if (this.y > this.game.height) this.y = this.height;

        }
        update(isEnemy){
            if (isEnemy){
                if (this.speed > 0){
                    this.x += this.speed;
                    if (this.x > this.game.width * 1) this.markedForDeletion = true;
                }
                else {
                    this.x += this.speed;
                    if (this.x < this.game.width * 0) this.markedForDeletion = true;  
                }                
            }

            else {
                if (this.speed > 0){
                    this.x += this.speed;
                    if (this.x > this.game.width * 0.42) this.markedForDeletion = true;
                }
                else {
                    this.x += this.speed;
                    if (this.x < this.game.width * 0.58) this.markedForDeletion = true;  
                }
            }


        }
        draw(context){
            context.drawImage(this.image, this.x, this.y);
        }

    }

    class Particle {
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('sonic');
            this.size = 25;
            this.speedX = Math.random() * 6 -3;
            this.speedY = Math.random() - 15;
            this.gravity = 0.5;
            this.markedForDeletion = false;
            this.angle = 0;
            this.bounced = 0;
            this.bottomBounceBoundary = Math.random() * 100 + 60;

        }
        update(){
            this.speedY += this.gravity;
            this.x -= this.speedX;
            this.y += this.speedY;
            if (this.y > this.game.height + this.size || this.x < - this.size) this.markedForDeletion = true;
            if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 2){
                this.bounced ++;
                this.speedY *= -0.65;
            }
        }
        draw(context){
            context.save();
            context.drawImage(this.image, this.x, this.y, this.size, this.size);
            context.restore();
        }
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
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerupLimit = 10000;
        }
        update(key1, key2, deltaTime){
            if( this.game.keys.includes(key1)) this.speedY = -this.maxSpeed;
            else if( this.game.keys.includes(key2)) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;
            if(this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
            else if(this.y < - this.height * 0.5) this.y = - this.height * 0.5;

            //projectiles
            this.projectiles.forEach(projectile =>{
                projectile.update(false);
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

            //power up
            if (this.powerUp){
                if (this.powerUpTimer > this.powerupLimit){
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                }
                else {
                    this.powerUpTimer += deltaTime;
                    if (this.ammo < this.maxAmmo + 20) this.ammo += 0.1;
                }
            }
        }
        draw(context){
            this.projectiles.forEach(projectile =>{
                projectile.draw(context);
            });
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
        }
        shootTop(speed){
            if (this.ammo > 0 && speed > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, speed, false));
                this.ammo--;
            }
            else if (this.ammo > 0 && speed < 0){
                this.projectiles.push(new Projectile(this.game, this.x + 20, this.y + 30, speed, false));
                this.ammo--;
            }
            if (this.powerUp) this.shootBottom(speed);
        }
        shootBottom(speed){
            if (this.ammo > 0 && speed > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 100, speed, false));
            }
            else if (this.ammo > 0 && speed < 0){
                this.projectiles.push(new Projectile(this.game, this.x + 20, this.y + 100, speed, false));
            }
        }
        enterPowerUp(){
            this.powerUpTimer = 0;
            this.powerUp = true;
            if (this.ammo < this.maxAmmo) this.ammo = this.maxAmmo;
        }
    }
    class Enemy {
        constructor(game){
            this.game = game;
            this.x = this.game.width / 2 - 50;
            this.speedX = Math.random() * -0.375 -0.375;
            this.markedForDeletion = false;

        }
        update(){
            if (this.speedX < 0){
                this.x += this.speedX - this.game.speed / 4;
            }
            else{
                this.x += this.speedX + this.game.speed / 4; 
            }
            if (this.x + this.width < 0) this.markedForDeletion = true;
        }
        draw(context){
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
            context.fillStyle = 'black';
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }
    }
    class Roei extends Enemy {
        constructor(game){
            super(game);
            this.lives = 2;
            this.score = this.lives;
            this.width = 120;
            this.height = 190;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('roei');
        }
    }
    class Liad extends Enemy {
        constructor(game){
            super(game);
            this.lives = 4;
            this.score = this.lives;
            this.width = 120;
            this.height = 190;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('liad');
        }
    }
    class Yotam extends Enemy {
        constructor(game){
            super(game);
            this.lives = 3;
            this.score = 15;
            this.width = 120;
            this.height = 190;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('yotam');
            this.type = 'lucky';
        }
    }

    class Tsuberi extends Enemy {
        constructor(game){
            super(game);
            this.lives = 50;
            this.score = this.lives;
            this.width = 166;
            this.height = 444;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('tsuberi');
            this.type = 'tsuberi';
            this.speedX = Math.random() * -0.000000000000001;;
            this.projectiles = [];
            this.timer = 0;
        }
        shootTop(speed){
            if (speed > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, speed, true));
                this.ammo--;
            }
            else {
                this.projectiles.push(new Projectile(this.game, this.x + 20, this.y + 30, speed, true));
                this.ammo--;
            }
            if (this.powerUp) this.shootBottom(speed);
        }
        update(){
            if (this.speedX < 0){
                this.x += this.speedX - this.game.speed / 4;
            }
            else{
                this.x += this.speedX + this.game.speed / 4; 
            }

            //projectiles
            this.projectiles.forEach(projectile =>{
                projectile.update(true);
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion );

            
        }
        draw(context){
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
            context.fillStyle = 'black';
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
            
            this.projectiles.forEach(projectile =>{
                projectile.draw(context);
            });
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y);
        }
    }

    class Layer {
        constructor(game, image, speedModifier, x){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = x;
            this.y = 0;
        }
        update(){
            if (this.x <= -this.width) this.x = 0;
            else if (this.x >= this.width) this.x = 0;
            this.x -= this.game.speed * this.speedModifier;
        }

        draw(context, playerNum){
            context.drawImage(this.image, this.x, this.y);

            if (playerNum == 1){
                context.drawImage(this.image, this.x + this.width, this.y);
            }
            else if (playerNum == 2){
                context.drawImage(this.image, this.x -this.width, this.y);
            }

        }

    }

    class Background {
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.image5 = document.getElementById('layer5');

            //layer player 1
            this.layer1 = new Layer(this.game, this.image1, 0.2, 0);
            this.layer2 = new Layer(this.game, this.image2, 0.4, 0);
            this.layer3 = new Layer(this.game, this.image3, 1, 0);
            this.layer4 = new Layer(this.game, this.image4, 1.5, 0);

            //layer player 2
            this.layer6 = new Layer(this.game, this.image1, -0.2, 0);
            this.layer7 = new Layer(this.game, this.image2, -0.4, 0);
            this.layer8 = new Layer(this.game, this.image3, -1, 0);
            this.layer9 = new Layer(this.game, this.image4, -1.5, 0);

            //layer crack
            this.layer5 = new Layer(this.game, this.image5, 0, 0);

            this.layers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer6, this.layer7, this.layer8, this.layer9, this.layer5];
        }
        update(){
            this.layers.forEach(layer => layer.update());
        }
        draw(context){
            for (let index = 0; index < this.layers.length; index++) {
                const layer = this.layers[index];
                if (layer.speedModifier < 0){
                    layer.draw(context, 2); 
                }
            }
            this.layers.forEach(layer => {
                ctx.save(); // Save original state
        
                // Define clipping based on speed direction
                ctx.beginPath();
                if (layer.speedModifier > 0) {
                    // Moving left: Clip to the left half
                    ctx.rect(0, 0, canvas.width / 2, canvas.height);
                } else {
                    // Moving right: Clip to the right half
                    ctx.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
                }
                ctx.clip();
        
                // Draw object
                if (layer.speedModifier > 0) {
                    layer.draw(context, 1);
                }
                ctx.restore(); // Reset clipping for next object
                this.layers[8].draw(context, 0);

            });

            /*for (let index = 0; index < this.layers.length; index++) {
                const element = this.layers[index];
                if (index < 5){
                    element.draw(context, 1);
                } else {
                    element.draw(context, 2);
                }
                
            }*/
        }
    }

    class UI {
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Bangers';
            this.color = 'white';
        }
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            //score draw
            context.fillText('Score: ' + this.game.player1.score, 20, 40);
            context.fillText('Score: ' + this.game.player2.score, 850, 40);


            //timer draw
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: ' + formattedTime, 20, 100);
            context.fillText('Timer: ' + formattedTime, 850, 100);

            //ammo draw 
            if (this.game.player1.powerUp) context.fillStyle = 'yellow';
            for (let i = 0; i < this.game.player1.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            context.fillStyle = this.color;
            if (this.game.player2.powerUp) context.fillStyle = 'yellow';
            for (let i = 0; i < this.game.player2.ammo; i++){
                context.fillRect(850 + 5 * i, 50, 3, 20);
            }
            context.restore();
        }
        
    }
    
    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player1 = new Player(this, 20, 100);
            this.player2 = new Player(this, canvas.width - 140, 100);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.keys = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.gameOver = false;
            this.gameTime = 0;
            this.timeLimit = 120000;
            this.speed = 1;
        }
        update(deltaTime){
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.background.update();
            this.player1.update('w', 's', deltaTime);
            this.player2.update('ArrowUp', 'ArrowDown', deltaTime);
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
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player1, enemy)){
                    enemy.markedForDeletion = true;
                    for (let i = 0; i < 10; i++) {
                        this.particles.push(new Particle(game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                    }
                    if (enemy.type == 'lucky') this.player1.enterPowerUp();
                    else if (this.gameTime < this.timeLimit) this.player1.score -= enemy.lives;
                }
                else if (this.checkCollision(this.player2, enemy)){
                    enemy.markedForDeletion = true;
                    for (let i = 0; i < 10; i++) {
                        this.particles.push(new Particle(game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                    }
                    if (enemy.type == 'lucky') this.player2.enterPowerUp();
                    else if (this.gameTime < this.timeLimit) this.player2.score -= enemy.lives;
                }

                //player projectiles
                this.player1.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        this.particles.push(new Particle(game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                        if (enemy.lives <= 0){
                            for (let i = 0; i < 10; i++) {
                                this.particles.push(new Particle(game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            }
                            enemy.markedForDeletion = true;
                            if (!this.gameOver) this.player1.score += enemy.score;
                            
                        }
                    }
                });
                this.player2.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0){
                            for (let i = 0; i < 5; i++) {
                                this.particles.push(new Particle(game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            }
                            enemy.markedForDeletion = true;
                            this.particles.push(new Particle(game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                            if (!this.gameOver) this.player2.score += enemy.score;
                        }
                    }
                });

                //enemy projectiles
                if (enemy.type === 'tsuberi'){
                    enemy.projectiles.forEach(projectile => {
                        if (projectile.speed < 0){
                            if (this.checkCollision(projectile, this.player1)){
                                this.player1.score -= 5;
                                projectile.markedForDeletion = true;
                                this.particles.push(new Particle(game, this.player1.x + this.player1.width * 0.5, this.player1.y + this.player1.height * 0.5));
                            }
                        }
                        else {
                            if (this.checkCollision(projectile, this.player2)){
                                this.player2.score -= 5;
                                projectile.markedForDeletion = true;
                                this.particles.push(new Particle(game, this.player2.x + this.player2.width * 0.5, this.player2.y + this.player2.height * 0.5));
                            }
                        }
                    });
                }

                if (enemy.type === 'tsuberi' ){
                    enemy.timer += deltaTime;
                    if (enemy.timer > 1000){
                        enemy.timer = 0;
                        if (enemy.speedX > 0) enemy.shootTop(2);
                        else enemy.shootTop(-2);
                    }
                }
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy(1);
                this.addEnemy(2);
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context){
            this.background.draw(context);
            this.ui.draw(context);
            this.player1.draw(context);
            this.player2.draw(context);
            this.particles.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        }
        addEnemy(direction){
            const randomize = Math.random();
            if (randomize < 0.5) {
                if (direction === 1){
                    this.enemies.push(new Roei(this));
                }
                else {
                    let tempRoei = new Roei(this);
                    tempRoei.speedX = tempRoei.speedX * -1;
                    this.enemies.push(tempRoei);
                }
            }
            else if (randomize < 0.6){
                if (direction === 1){
                    this.enemies.push(new Yotam(this));
                }
                else {
                    let tempYotam = new Yotam(this);
                    tempYotam.speedX = tempYotam.speedX * -1;
                    this.enemies.push(tempYotam);
                }
            }
            else if (randomize < 0.62)  {
                if (direction === 1){
                    this.enemies.push(new Tsuberi(this));
                }
                else {
                    let tempTsuberi = new Tsuberi(this);
                    tempTsuberi.speedX = tempTsuberi.speedX * -1;
                    this.enemies.push(tempTsuberi);
                }
            }              
            
            else {
                if (direction === 1){
                    this.enemies.push(new Liad(this));
                }
                else {
                    let tempLiad = new Liad(this);
                    tempLiad.speedX = tempLiad.speedX * -1;
                    this.enemies.push(tempLiad);
                }
            }


        }
        checkCollision(rect1, rect2){
            return (rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.y + rect1.height > rect2.y);
        }
    }

    const game = new Game(canvas.width, canvas.height);
    game.gameTime = 0;  // Reset game time when the game starts
    let lastTime = performance.now();  // Get the actual time when the game starts
    //animation loops
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(lastTime);

}

function showInstructions() {
    alert("Use arrow keys to move your character and spacebar to jump. Avoid obstacles and reach the finish line!");
}
