import { Projectile } from './Projectile.js';

export class Player {
    constructor(game, x, y, isEnd = false, canShoot = true){
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
        this.lives = 100;
        this.isEnd = isEnd;
        this.canShoot = canShoot;
    }
    update(key1, key2, deltaTime, isEnd = false, canShoot){
        if (!canShoot) {
            this.ammo = 0;
            this.maxAmmo = 0;
        }
        else this.maxAmmo = 30;
        
        if( this.game.keys.includes(key1)) this.speedY = -this.maxSpeed;
        else if( this.game.keys.includes(key2)) this.speedY = this.maxSpeed;
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
    }
    draw(context){
        this.projectiles.forEach(projectile =>{
            projectile.draw(context);
        });
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y);
    }
    shootTop(speed, isEnd = false){                
        if (this.ammo > 0 && speed > 0){
            this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, speed, false, isEnd));
            this.ammo--;
        }
        else if (this.ammo > 0 && speed < 0){
            this.projectiles.push(new Projectile(this.game, this.x + 20, this.y + 30, speed, false, isEnd));
            this.ammo--;
        }
        if (this.powerUp) this.shootBottom(speed);
    }
    shootBottom(speed, isEnd = false){
        if (this.ammo > 0 && speed > 0){
            this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 100, speed, false, isEnd));
        }
        else if (this.ammo > 0 && speed < 0){
            this.projectiles.push(new Projectile(this.game, this.x + 20, this.y + 100, speed, false, isEnd));
        }
    }
    enterPowerUp(){
        this.powerUpTimer = 0;
        this.powerUp = true;
        if (this.ammo < this.maxAmmo) this.ammo = this.maxAmmo;
    }
}