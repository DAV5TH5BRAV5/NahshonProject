import { Enemy } from './Enemy.js';
import { Projectile } from './Projectile.js';

export class Tsuberi extends Enemy {
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
        this.maxFrame = 0;
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
        context.drawImage(this.image, this.x, this.y);

        
        this.projectiles.forEach(projectile =>{
            projectile.draw(context);
        });
        context.drawImage(this.image, this.x, this.y);
    }
}