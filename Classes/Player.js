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
    }
    update(key1, key2, deltaTime, isEnd = false, canShoot){
        if (!canShoot) {
            this.ammo = 0;
            this.maxAmmo = 0;
            this.powerUp = false;
        }
        else this.maxAmmo = 30;
        
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
            if (this.powerUpTimer > this.powerupLimit){
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
            this.frameTimer = 0;  // Reset timer
        }
    }
    draw(context){
        this.projectiles.forEach(projectile =>{
            projectile.draw(context);
        });
        context.strokeRect(this.x, this.y, this.width, this.height);
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
    }
    shootTop(speed, isEnd = false){
        if (this.ammo > 0 && speed > 0){
            if (this.id == 2) this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, speed, false, isEnd, this.id, false));
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

        }
        else if (this.ammo > 0 && speed < 0){
            if (this.id == 2) this.projectiles.push(new Projectile(this.game, this.x - 80, this.y + 30, speed, false, isEnd, this.id, false));
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
        }
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
}