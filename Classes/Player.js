import { Projectile } from './Projectile.js';

export class Player {
    constructor(game, x, y, isEnd = false, canShoot = true){
        this.game = game;
        this.width = 77;
        this.height = 160;
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
        this.powerUp = false;
        this.powerUpTimer = 0;
        this.powerupLimit = 10000;
        this.lives = 100;
        this.isEnd = isEnd;
        this.canShoot = canShoot;
        this.tempAmmo = 0;

        //frames
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 4;
        this.frameTimer = 0; // Track time between frame updates
        this.frameInterval = 100;
        this.adjustX = 0;
        this.adjustWidth = 0;  
        this.adjustHeight = 0;
        this.id = 0;

        //Sounds
        this.shootingSound = new Audio('./assets/sounds/cardThrowSound.mp3');
        this.shootingSoundPlaying = false;

        //Hit effect
        this.hitTimer = 0;
        this.hitDuration = 200; //Duration

        //winning
        this.winningImage = new Image();
        this.winningImage.src = './assets/winningImages/winningImageEli.png';
        this.winningSoundPlayed = false; // Make sure its only played once
        this.winningSound = new Audio('./assets/sounds/winningSoundGeneral.mp3');

        //controller Vibrate Allower
        this.allowControllerVibrate = true;
    }
    update(key1, key2, deltaTime, isEnd = false, canShoot){
        if (!canShoot) {
            if (this.ammo != 0) this.tempAmmo = this.ammo;
            this.ammo = 0;
            this.maxAmmo = 0;
            this.powerUp = false;
        }
        else{
            this.maxAmmo = 30;
            if (this.tempAmmo != 0){
                this.ammo = this.tempAmmo;
                this.tempAmmo = 0;
            } 
        } 
    
        if(this.game.keys.includes(key1)) this.speedY = -this.maxSpeed;
        else if(this.game.keys.includes(key2)) this.speedY = this.maxSpeed;
        else this.speedY = 0;
        this.y += this.speedY;
        if(this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
        else if(this.y < 0) this.y = 0;

        //projectiles
        this.projectiles.forEach(projectile =>{
            projectile.update(false, isEnd);
        });
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

        //power up
        if (this.powerUp){
            if (this.powerUpTimer > this.powerupLimit || this.isEnd){
                this.powerUpTimer = 0;
                this.powerUp = false;
            }
            else {
                this.powerUpTimer += deltaTime;
                if (this.ammo < this.maxAmmo + 20) this.ammo += 0.1;
            }
        }


        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else if (this.id == 2 && this.powerUp) this.frameX = 3;
            else this.frameX = 0;

            if (this.powerUp && this.id == 2 && this.frameX == this.maxFrame){
                this.frameY = 2;
                this.frameX = 0;
                this.maxFrame = 9;
                this.frameInterval = 70;
                this.adjustWidth = 119;
                this.adjustHeight = 29; 
            }
            else if (!this.powerUp && this.id == 2 && this.frameY == 2){
                this.frameY = 0;
                this.frameX = 0;
                this.maxFrame = 5;
                this.frameInterval = 125;
                this.adjustWidth = 0;
                this.adjustHeight = 0; 
            }
            if (this.frameY == 1 && this.id == 1 && this.frameX == this.maxFrame) {
                this.frameY = 0;
                this.frameX = 0;
                this.maxFrame = 4;
                this.frameInterval = 150;
                this.adjustWidth = 0;
                this.adjustHeight = 0;
            }
            else if (this.frameY == 1 && this.id == 2 && this.frameX == this.maxFrame){
                this.frameY = 0;
                this.frameX = 0;
                this.maxFrame = 5;
                this.frameInterval = 125;
                this.adjustWidth = 0;
                this.adjustHeight = 0;
            }
            else if (this.frameY == 1 && this.id == 3 && this.frameX == this.maxFrame){
                this.frameY = 0;
                this.frameX = 0;
                this.maxFrame = 4;
                this.frameInterval = 125;
                this.adjustWidth = 0;
                this.adjustHeight = 0;
            }
            else if (this.frameY == 1 && this.id == 4 && this.frameX == this.maxFrame){
                this.frameY = 0;
                this.frameX = 0;
                this.maxFrame = 9;
                this.frameInterval = 100;
                this.adjustWidth = 0;
                this.adjustHeight = 0;
            }
            this.frameTimer = 0;  // Reset timer
        }
        if (this.hitTimer > 0) {
            this.hitTimer -= deltaTime;
        }

    }
    draw(context){
        this.projectiles.forEach(projectile =>{
            projectile.draw(context);
        });
        if (this.x > 500) {
            context.save();
            context.scale(-1, 1);  // Flip horizontally
            if (this.id == 2 && this.x > 500 && this.powerUp) context.drawImage(this.image, this.frameX * (this.width + this.adjustWidth), this.frameY * this.height + this.adjustHeight,
                                                                this.width + this.adjustWidth, this.height + this.adjustHeight, -this.x - this.width - 50, this.y, this.width + this.adjustWidth,
                                                                this.height);
            
            else context.drawImage(this.image, this.frameX * (this.width + this.adjustWidth), this.frameY * this.height + this.adjustHeight,
                    this.width + this.adjustWidth, this.height + this.adjustHeight, -this.x - this.width, this.y, this.width + this.adjustWidth,
                    this.height);
            context.restore();
        }
        else {
            if (this.id == 2 && this.x > 500 && this.powerUp) context.drawImage(this.image, this.frameX * (this.width + this.adjustWidth), this.frameY * this.height + this.adjustHeight,
                                                                this.width + this.adjustWidth, this.height, this.x - 50, this.y, this.width + this.adjustWidth, this.height);
            
            
            else context.drawImage(this.image, this.frameX * (this.width + this.adjustWidth), this.frameY * this.height + this.adjustHeight,
                    this.width + this.adjustWidth, this.height, this.x, this.y, this.width + this.adjustWidth, this.height);
        }

        if (this.hitTimer > 0) {
            const offScreenCanvas = document.createElement('canvas');
            offScreenCanvas.width = this.width + this.adjustWidth;
            offScreenCanvas.height = this.height;
            const offScreenContext = offScreenCanvas.getContext('2d');

            offScreenContext.drawImage(
                this.image,
                this.frameX * (this.width + this.adjustWidth),
                this.frameY * this.height + this.adjustHeight,
                this.width + this.adjustWidth,
                this.height,
                0,
                0,
                this.width + this.adjustWidth,
                this.height
            );

            const imageData = offScreenContext.getImageData(0, 0, this.width + this.adjustWidth, this.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 0) {  
                    data[i] = 255;  
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                    data[i + 3] = Math.min(data[i + 3], 255 * (this.hitTimer / this.hitDuration));
                }
            }

            offScreenContext.putImageData(imageData, 0, 0);

            if (this.x > 500) {
                context.save();
                context.scale(-1, 1);
                context.drawImage(offScreenCanvas, -this.x - this.width, this.y);
                context.restore();
            } else {
                context.drawImage(offScreenCanvas, this.x, this.y);
            }
        }
    }
    shootTop(speed, isEnd = false){
        if (this.ammo > 0 && speed > 0){
            this.allowControllerVibrate = true;
            if (this.id == 2 || this.id == 4) this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, speed, false, isEnd, this.id, false));
            else this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, speed, false, isEnd, this.id));
            this.ammo--;
            if (this.id == 1 && this.frameY != 1){
                this.frameY = 1;
                this.frameX = 0;
                this.maxFrame = 6;
                this.frameInterval = 75;
                this.adjustWidth = 69;  
                this.adjustHeight = 30;
            }
            else if (this.id == 2 && this.frameY != 1 && !this.powerUp) {
                this.frameY = 1;
                this.frameX = 0;
                this.maxFrame = 9;
                this.frameInterval = 65;
                this.adjustWidth = 49;
                this.adjustHeight = 0;
            }
            else if (this.id == 3 && this.frameY != 1) {
                this.frameY = 1;
                this.frameX = 0;
                this.maxFrame = 11;
                this.frameInterval = 55;
                this.adjustWidth = 45;
                this.adjustHeight = 0;
            }
            else if (this.id == 4 && this.frameY != 1) {
                this.frameY = 1;
                this.frameX = 0;
                this.maxFrame = 9;
                this.frameInterval = 75;
                this.adjustWidth = 11;
                this.adjustHeight = 0;
            }
            if (!this.shootingSoundPlaying) {
                this.shootingSound.play();
                this.shootingSoundPlaying = true;
                this.shootingSound.onended = () => {
                    this.shootingSoundPlaying = false;
                };
            }

        }
        else if (this.ammo > 0 && speed < 0){
            if (this.id == 2 || this.id == 4) this.projectiles.push(new Projectile(this.game, this.x - 80, this.y + 30, speed, false, isEnd, this.id, false));
            else this.projectiles.push(new Projectile(this.game, this.x - 80, this.y + 30, speed, false, isEnd, this.id));
            this.ammo--;
            if (this.id == 1 && this.frameY != 1){
                this.frameY = 1;
                this.frameX = 0;
                this.maxFrame = 6;
                this.frameInterval = 75;
                this.adjustWidth = 69;  
                this.adjustHeight = 30;
            }
            else if (this.id == 2 && this.frameY != 1 && !this.powerUp) {
                this.frameY = 1;
                this.frameX = 0;
                this.maxFrame = 9;
                this.frameInterval = 65;
                this.adjustWidth = 49;
                this.adjustHeight = 0;
            }
            else if (this.id == 3 && this.frameY != 1) {
                this.frameY = 1;
                this.frameX = 0;
                this.maxFrame = 11;
                this.frameInterval = 55;
                this.adjustWidth = 45;
                this.adjustHeight = 0;
            }
            else if (this.id == 4 && this.frameY != 1) {
                this.frameY = 1;
                this.frameX = 0;
                this.maxFrame = 9;
                this.frameInterval = 75;
                this.adjustWidth = 11;
                this.adjustHeight = 0;
            }
            if (!this.shootingSoundPlaying) {
                this.shootingSound.play();
                this.shootingSoundPlaying = true;
                this.shootingSound.onended = () => {
                    this.shootingSoundPlaying = false;
                };
            }
        }
        else if (this.ammo <= 0) this.allowControllerVibrate = false;
        if (this.powerUp) this.shootBottom(speed);
    }
    shootBottom(speed, isEnd = false){
        if (this.ammo > 0 && speed > 0){
            if (this.id == 2) this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 100, speed, false, isEnd, this.id, false));
            else this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 100, speed, false, isEnd, this.id));
            
        }
        else if (this.ammo > 0 && speed < 0){
            if (this.id == 2) this.projectiles.push(new Projectile(this.game, this.x - 80, this.y + 100, speed, false, isEnd, this.id, false));
            else this.projectiles.push(new Projectile(this.game, this.x - 80, this.y + 100, speed, false, isEnd, this.id));

        }
    }
    enterPowerUp(){
        this.powerUpTimer = 0;
        this.powerUp = true;
        if (this.ammo < this.maxAmmo) this.ammo = this.maxAmmo;
    }

    hit() {
        this.hitTimer = this.hitDuration;
    }
}