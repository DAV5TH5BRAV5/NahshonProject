import { InputHandler } from './InputHandler.js';
import { Particle } from './Particle.js';
import { Player } from './Player.js';
import { Itay } from './Itay.js';
import { Alex } from './Alex.js';
import { Yotam } from './Yotam.js';
import { Tsuberi } from './Tsuberi.js';
import { Background } from './Background.js';
import { UI } from './UI.js';

export class Game {
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.background = new Background(this);
        this.player1 = new Player(this, 20, 100); // position of spawned player 1
        this.player2 = new Player(this, width - 140, 100); // position of spawned player 2 opposite of p1
        this.input = new InputHandler(this);
        this.ui = new UI(this);
        this.enemies = [];
        this.particles = [];
        this.keys = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000; // 1 second between each enemy is spawned
        this.gameOver = false;
        this.gameTime = 0;
        this.timeLimit = 120000; // 120 seconds for the game
        this.speed = 1;

        //event1
        this.eventActive = false;
        this.eventCooldown = 20000; // 20 seconds
        this.nextEventTime = performance.now() + this.eventCooldown;
        this.eventWinner = null;
        this.showScreenImage = false;
        this.targets = [];
        this.targetImage = new Image();
        this.targetImage.src = './assets/Props/tankTarget.png';
        this.screenImage = new Image();
        this.screenImage.src = './assets/Instructions And Events/tsuberiTank.png';
        this.eventGlowTimer = 0;

        //event 2
        this.movementRestriction = null;

        //event 3
        this.bouncingEffect = null;

        //event sound
        this.eventSoundPlayed = false; // Make sure its only played once
        this.eventSound = new Audio('./assets/sounds/winningSoundGeneral.mp3');

        //handle last game is over
        this.lastGameOver = false;

    }
    update(deltaTime){
        if (!this.gameOver) this.gameTime += deltaTime; // if game 1 aint over track how long its been
        if (this.gameTime >= this.timeLimit) this.gameOver = true; // if game 1 over shoot me (or set gameOver to true)
        if (this.gameOver) this.enemies = []; // if game 1 is over remove all enemies

        // set all updates in classes
        this.input.update();
        this.background.update();
        this.player1.update('w', 's', deltaTime, this.player1.isEnd, this.player1.canShoot);
        this.player2.update('ArrowUp', 'ArrowDown', deltaTime, this.player2.isEnd, this.player2.canShoot);
        
        // increase ammo if enough time passed
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

        // update particles
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => !particle.markedForDeletion);            
        
        //check if player 1 hit player 2 in end game
        if (this.player1.isEnd){
            this.player1.projectiles.forEach(projectile => {
                if (this.checkCollision(projectile, this.player2)){
                    this.player2.hit();
                    this.player2.lives--;
                    projectile.markedForDeletion = true;
                    this.particles.push(new Particle(this, this.player2.x + this.player2.width * 0.5, this.player2.y + this.player2.height * 0.5));
                }
            });

            // check if player 1 won
            if (this.player2.lives <= 0){
                this.player1.canShoot = false;
                this.player2.canShoot = false;
                this.screenImage.src = this.player1.winningImage.src;
                this.showScreenImage = true;
                this.lastGameOver = true;
                if (!this.player1.winningSoundPlayed) {
                    this.eventSound.pause();
                    this.player1.winningSound.play();
                    this.player1.winningSoundPlayed = true;
                }
            }
        }

        // check if player 2 hit player 1 in end game
        if (this.player2.isEnd){
            this.player2.projectiles.forEach(projectile => {
                if (this.checkCollision(projectile, this.player1)){
                    this.player1.hit();
                    this.player1.lives--;
                    projectile.markedForDeletion = true;
                    this.particles.push(new Particle(this, this.player1.x + this.player1.width * 0.5, this.player1.y + this.player1.height * 0.5));
                } 
            });

            // check if player 2 won
            if (this.player1.lives <= 0){
                this.player1.canShoot = false;
                this.player2.canShoot = false;
                this.screenImage.src = this.player2.winningImage.src;
                this.showScreenImage = true;
                this.lastGameOver = true;
                if (!this.player2.winningSoundPlayed) {
                    this.eventSound.pause();
                    this.player2.winningSound.play();
                    this.player2.winningSoundPlayed = true;
                }
            }
        }

        //if its not end game check if an enemy hit a player
        else{
            this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
            if (this.checkCollision(this.player1, enemy)){ // if enemy hit player 1
                enemy.markedForDeletion = true;
                // spawn 10 particles
                for (let i = 0; i < 10; i++) {
                    this.particles.push(new Particle(this,
                                                      enemy.x + enemy.width * 0.5, // create particles AROUND the enemy if hit
                                                       enemy.y + enemy.height * 0.5)); // create particles AROUND the enemy if hit
                }
                if (enemy.type == 'lucky'){ // check if its Yotam who hit the player
                    if (this.player1.id == 2 && !this.player1.powerUp){ // if the player is Shai and isn't already in power up state
                        this.player1.frameY = 2; // set his animation to the power up animation
                        this.player1.frameX = 0;
                        this.player1.maxFrame = 9;
                        this.player1.frameInterval = 70;
                        this.player1.adjustWidth = 119;
                        this.player1.adjustHeight = 29;
                        let shootingSound = new Audio('./assets/sounds/shaiClashYotam.m4a');
                        shootingSound.play();
                    }
                    this.player1.enterPowerUp();
                } 
                // decrease player's score by remaining enemy lives
                else if (this.gameTime < this.timeLimit) this.player1.score -= enemy.lives;
            }
            else if (this.checkCollision(this.player2, enemy)){ // if enemy hit player 2
                enemy.markedForDeletion = true;
                // spawn 10 particles
                for (let i = 0; i < 10; i++) {
                    this.particles.push(new Particle(this,
                                                     enemy.x + enemy.width * 0.5, // create particles AROUND the enemy if hit
                                                      enemy.y + enemy.height * 0.5)); // create particles AROUND the enemy if hit
                }
                if (enemy.type == 'lucky'){ // check if its Yotam who hit the player
                    if (this.player2.id == 2 && !this.player2.powerUp){ // if the player is Shai and isn't already in power up state
                        this.player2.frameY = 2; // set his animation to the power up animation
                        this.player2.frameX = 0;
                        this.player2.maxFrame = 9;
                        this.player2.frameInterval = 70;
                        this.player2.adjustWidth = 119;
                        this.player2.adjustHeight = 29;
                        let shootingSound = new Audio('./assets/sounds/shaiClashYotam.m4a');
                        shootingSound.play();
                    }
                    this.player2.enterPowerUp();

                } 
                // decrease player's score by remaining enemy lives
                else if (this.gameTime < this.timeLimit) this.player2.score -= enemy.lives;
            }

            //player1 projectiles
            this.player1.projectiles.forEach(projectile => {
                if (this.checkCollision(projectile, enemy)){
                    enemy.lives--;
                    projectile.markedForDeletion = true;
                    this.particles.push(new Particle(this,
                                                     enemy.x + enemy.width * 0.5, // create particles AROUND the enemy if hit
                                                      enemy.y + enemy.height * 0.5)); // create particles AROUND the enemy if hit
                    enemy.hit();
                    // check if the enemy died
                    if (enemy.lives <= 0){
                        // spawn 10 particles
                        for (let i = 0; i < 10; i++) {
                            this.particles.push(new Particle(this,
                                                             enemy.x + enemy.width * 0.5, // create particles AROUND the enemy if hit
                                                              enemy.y + enemy.height * 0.5)); // create particles AROUND the enemy if hit
                        }
                        enemy.markedForDeletion = true;
                        // increase player's score by how many points the enemy was worth
                        if (!this.gameOver) this.player1.score += enemy.score; 
                    }
                }
            });
            //player2 projectiles
            this.player2.projectiles.forEach(projectile => {
                if(!this.player2.isEnd){
                    if (this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        this.particles.push(new Particle(this,
                            enemy.x + enemy.width * 0.5, // create particles AROUND the enemy if hit
                             enemy.y + enemy.height * 0.5)); // create particles AROUND the enemy if hit
                        
                        enemy.hit();
                        // check if the enemy died
                        if (enemy.lives <= 0){
                            // spawn 10 particles
                            for (let i = 0; i < 10; i++) {
                                this.particles.push(new Particle(this,
                                                                  enemy.x + enemy.width * 0.5, // create particles AROUND the enemy if hit
                                                                   enemy.y + enemy.height * 0.5)); // create particles AROUND the enemy if hit
                            }
                            enemy.markedForDeletion = true;
                            // increase player's score by how many points the enemy was worth
                            if (!this.gameOver) this.player2.score += enemy.score;
                        }
                    }
                }
            });

            //enemy projectiles
            if (enemy.type === 'tsuberi'){
                enemy.projectiles.forEach(projectile => {
                    if (projectile.speed < 0){ // check if shooting at player 1
                        if (this.checkCollision(projectile, this.player1)){
                            this.player1.hit();
                            this.player1.score -= 5; // remove 5 score points from player 1
                            projectile.markedForDeletion = true;
                            this.particles.push(new Particle(this,
                                                              this.player1.x + this.player1.width * 0.5, // create particles AROUND player 1 if hit
                                                               this.player1.y + this.player1.height * 0.5)); // create particles AROUND player 1 if hit
                        }
                    }
                    else { // shooting at player 2
                        if (this.checkCollision(projectile, this.player2)){
                            this.player2.hit();
                            this.player2.score -= 5; // remove 5 score points from player 2
                            projectile.markedForDeletion = true;
                            this.particles.push(new Particle(this,
                                                              this.player2.x + this.player2.width * 0.5, // create particles AROUND player 2 if hit
                                                               this.player2.y + this.player2.height * 0.5)); // create particles AROUND player 2 if hit
                        }
                    }
                });
            }

            // lets tsuberi enemy type shoot once per second
            if (enemy.type === 'tsuberi' ){
                enemy.timer += deltaTime;
                if (enemy.timer > 1000){
                    enemy.timer = 0;
                    if (enemy.speedX > 0) // check if shooting at player 1
                        enemy.shootTop(2); // speed of bullet is 2
                    else // check if shooting at player 1
                    enemy.shootTop(-2); // speed of bullet is 2
                }
            }
        });
        }
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion); // delete all enemies marked to delete
        // spawn an enemy if enough time passed (1 second) and if its not the end game yet
        if (this.enemyTimer > this.enemyInterval && !this.gameOver){
            this.addEnemy(1); // spawn enemy at p1
            this.addEnemy(2); // spawn enemy at p2
            this.enemyTimer = 0; // reset enemy timer
        } else {
            this.enemyTimer += deltaTime;
        }

        if (this.player1.isEnd) { // check if its end game
            const currentTime = performance.now();
            //check if enough time passed to activate an event
            if (!this.eventActive && currentTime >= this.nextEventTime) {
                this.activateEvent(); // activate an event
            }
        }
        if (this.eventActive) { // check if an event is active
            this.eventGlowTimer += deltaTime * 0.1; // set a glow effect
        }

        if (this.movementRestriction) { // if the event movementRestriction is active
            const { player, minY, maxY } = this.movementRestriction;
            if (player.y < minY) player.y = minY;
            if (player.y + player.height > maxY ) player.y = maxY - player.height;
        }

        if (this.bouncingEffect) { // if the event bouncingEffect is active
            const { player, initialY, amplitude, elapsedTime } = this.bouncingEffect;
            this.bouncingEffect.elapsedTime += deltaTime;
            // set the bouncing effect to be gradual (using PI and dividing by a large number 500)
            player.y = initialY + Math.sin(this.bouncingEffect.elapsedTime * Math.PI / 500) * amplitude;
        }
    }
    draw(context){

        // draw each class
        this.background.draw(context, this.background.isBeginAnim);
        this.ui.draw(context, this.player1.isEnd);
        this.player1.draw(context);
        this.player2.draw(context);
        this.particles.forEach(particle => particle.draw(context));
        this.enemies.forEach(enemy => {
            enemy.draw(context);
        });

        //event
        if (this.showScreenImage) {
            context.drawImage(this.screenImage, 0, 0, this.width, this.height);
        }
        
        // Draw event targets
        this.targets.forEach(target => {
            context.drawImage(this.targetImage, target.x, target.y, 50, 50);
        });

        // handle the glow effect when event is active
        if (this.eventActive) { // if event is active
            context.save();
            const glowIntensity = (Math.sin(this.eventGlowTimer * 3) + 1) / 2; // sin to make sure event glow is gradual
            context.strokeStyle = `rgba(0, 0, 255, ${glowIntensity})`;
            context.lineWidth = 10; // size of the glow
            context.strokeRect(0, 0, this.width, this.height);
            context.restore();
        }

        // Draw movement restriction
        if (this.movementRestriction) {
            const { minY, maxY, player } = this.movementRestriction;
            context.fillStyle = 'rgba(255, 0, 0, 0.5)';
            context.fillRect(player.x - 20, minY - 5, player.width + 40, 5); // position of movement restrictions rectangles
            context.fillRect(player.x - 20, maxY, player.width + 40, 5); // position of movement restrictions rectangles
        }

    }
    addEnemy(direction){
        const randomize = Math.random(); // when an enemy spawns make him random
        if (randomize < 0.5) { // spawn Itay 50%
            if (direction === 1){ // towards p1
                this.enemies.push(new Itay(this));
            }
            else { // towards p2
                let tempItay = new Itay(this);
                tempItay.speedX = tempItay.speedX * -1;
                this.enemies.push(tempItay);
            }
        }
        else if (randomize < 0.6){ // spawn Yotam 10%
            if (direction === 1){ // towards p1
                this.enemies.push(new Yotam(this));
            }
            else { // towards p2
                let tempYotam = new Yotam(this);
                tempYotam.speedX = tempYotam.speedX * -1;
                this.enemies.push(tempYotam);
            }
        }
        else if (randomize < 0.62)  { // spawn Tsuberi 2%
            if (direction === 1){ // towards p1
                this.enemies.push(new Tsuberi(this));
            }
            else { // towards p2
                let tempTsuberi = new Tsuberi(this);
                tempTsuberi.speedX = tempTsuberi.speedX * -1;
                this.enemies.push(tempTsuberi);
            }
        }              
        
        else { // spawn Alex 38%
            if (direction === 1){ // towards p1
                this.enemies.push(new Alex(this));
            }
            else { // towards p2
                let tempAlex = new Alex(this);
                tempAlex.speedX = tempAlex.speedX * -1;
                this.enemies.push(tempAlex);
            }
        }


    }

    // checks if 2 objects collided
    checkCollision(rect1, rect2){
        return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y);
    }
    

    //events

    //activate an event sequence
    activateEvent() {
        if (!this.lastGameOver){
            this.eventActive = true;
            this.eventGlowTimer = 0;
            this.eventWinner = null;
            document.body.classList.add('event-glow');
            this.input.enableEventListeners();
    
            setTimeout(() => {
                this.eventActive = false;
                document.body.classList.remove('event-glow');
                this.nextEventTime = performance.now() + this.eventCooldown;
            }, 5000);
        }
    }

    // tank event
    triggerAttack(attacker, defender) {
        if (this.eventActive && !this.eventWinner) {
            this.screenImage.src = './assets/Instructions And Events/tsuberiTank.png';
            this.eventWinner = attacker;
            this.showScreenImage = true;
            this.player1.canShoot = false;
            this.player2.canShoot = false;
            this.player1.projectiles = [];
            this.player2.projectiles = [];
            if (!this.eventSoundPlayed){
                this.eventSound = new Audio('./assets/sounds/tsuberiTankVoice.mp3');
                this.eventSoundPlayed = true;
                this.eventSound.play();
            }

            setTimeout(() => {
                this.showScreenImage = false;
                this.player1.canShoot = true;
                this.player2.canShoot = true;
                this.eventSoundPlayed = false;
                this.targets = [];
                // fire 10 shots
                for (let i = 0; i < 10; i++) {
                    if (attacker.x > 750){ // check if p2 won the event
                        // spawn target in the general area of the losing player (3 times his width)
                        let x = defender.x + Math.random() * defender.width * 3; 
                        let y = Math.random() * this.height;
                        this.targets.push({ x, y, width: 50, height: 50 });
                    }
                    else { // check if p1 won the event
                        // spawn target in the general area of the losing player (3 times his width)
                        let x = defender.x - 240 + Math.random() * defender.width * 3;
                        let y = Math.random() * this.height;
                        this.targets.push({ x, y, width: 50, height: 50 });
                    }

                }
                // waits 3 seconds before checking if a target hit a player
                setTimeout(() => {
                    this.targets.forEach(target => {
                        if (this.checkCollision(target, defender)) {
                            defender.lives -= 10; // remove 10 lives per shot
                        }
                    });
                    this.targets = [];
                }, 2000);

            }, 3000);
        }
    }

    // salute event
    triggerRestriction(attacker, defender) {
        if (this.eventActive && !this.eventWinner) {
            this.screenImage.src = './assets/Instructions And Events/tsuberiSalute.png';
            this.eventWinner = attacker;
            this.showScreenImage = true;
            this.player1.canShoot = false;
            this.player2.canShoot = false;
            this.player1.projectiles = [];
            this.player2.projectiles = [];
            if (!this.eventSoundPlayed){
                this.eventSound = new Audio('./assets/sounds/tsuberiSaluteVoice.mp3');
                this.eventSoundPlayed = true;
                this.eventSound.play();
            }

            setTimeout(() => {
                this.showScreenImage = false;
                this.player1.canShoot = true;
                this.player2.canShoot = true;
                this.eventSoundPlayed = false;
                defender.y = this.height / 2 - defender.height / 2; // Center defender
                const minY = defender.y - 75; // sets min restriction
                const maxY = defender.y + 75 + defender.height; // sets max restriction
                this.movementRestriction = { player: defender, minY, maxY };
                
                // restrictions are for 10 seconds
                setTimeout(() => {
                    this.movementRestriction = null;
                }, 10000);

            }, 3000);
        }
    }

    triggerBouncing(attacker, defender) {
        if (this.eventActive && !this.eventWinner) {
            this.screenImage.src = './assets/Instructions And Events/tsuberiPlane.png';
            this.eventWinner = attacker;
            this.showScreenImage = true;
            this.player1.canShoot = false;
            this.player2.canShoot = false;
            this.player1.projectiles = [];
            this.player2.projectiles = [];
            if (!this.eventSoundPlayed){
                this.eventSound = new Audio('./assets/sounds/tsuberiPlaneVoice.mp3');
                this.eventSoundPlayed = true;
                this.eventSound.play();
            }
            setTimeout(() => {
                this.showScreenImage = false;
                this.player1.canShoot = true;
                this.player2.canShoot = true;
                this.eventSoundPlayed = false;
                defender.y = this.height / 2 - defender.height / 2; // centers losing player
                defender.canShoot = false;
                const initialY = defender.y;
                const amplitude = 50; // sets the strength of the bouncing
                this.bouncingEffect = { player: defender, initialY, amplitude, elapsedTime: 0 };
                
                // bouncing lasts for 10 seconds
                setTimeout(() => {
                    this.bouncingEffect = null;
                    defender.canShoot = true;
                }, 10000);

            }, 3000);
        }
    }
}