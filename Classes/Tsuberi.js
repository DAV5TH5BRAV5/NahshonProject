import { Enemy } from './Enemy.js';
import { Projectile } from './Projectile.js';

export class Tsuberi extends Enemy {
    constructor(game){
        super(game);
        this.lives = 50;
        this.score = this.lives;
        this.width = 166; //width of enemy image
        this.height = 444; //height of enemy image
        this.y = Math.random() * (this.game.height * 0.95 - this.height); // adjust the spawning height of enemy
        this.image = document.getElementById('tsuberi');
        this.type = 'tsuberi';  // determine that this enemy is tsuberi for update events
        this.speedX = Math.random() * -0.000000000000001; // sets his speed very low
        this.projectiles = [];
        this.timer = 0; // timer to indicate how long to take before each shot can be taken again
        this.maxFrame = 0; // max frames of animation
        
    }
    shootTop(speed){
        if (speed > 0){ // to determine if tsuberi is going to player 1 or player 2
            this.projectiles.push(new Projectile(this.game, // entering the current game
                                                 this.x + 80, // Tsuberi shoots infront of him by 80 px
                                                  this.y + 30, // Tsuberi shoots above of him by 30 px
                                                   speed, // determine speed of bullet
                                                    true)); // determine if image can be mirrored
            this.ammo--; // lower ammo
        }
        else {
            this.projectiles.push(new Projectile(this.game, // entering the current game
                                                 this.x + 20, // Tsuberi shoots infront of him by 20 px
                                                  this.y + 30, // Tsuberi shoots above of him by 30 px
                                                   speed, // determine speed of bullet
                                                    true)); // determine if image can be mirrored
            this.ammo--; // lower ammo
        }
    }
    update(){
        if (this.speedX < 0){ // to determine if tsuberi is going to player 1 or player 2 
            this.x += this.speedX - this.game.speed / 4; /* move tsuberi by his speed and the speed of 
                                                          game divided by the speed the game is moving */
        }
        else{
            this.x += this.speedX + this.game.speed / 4; /* move tsuberi by his speed and the speed of 
                                                          game divided by the speed the game is moving */
        }

        //projectiles
        this.projectiles.forEach(projectile =>{
            projectile.update(true); //update each projectile
        });
        // removes projectile from projectiles storage if marked for deletion
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion ); 

        
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y);
        this.projectiles.forEach(projectile =>{
            projectile.draw(context); // draw projectile
        });
        context.drawImage(this.image, this.x, this.y);
    }
}