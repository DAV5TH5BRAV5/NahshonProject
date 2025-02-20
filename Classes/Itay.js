import { Enemy } from './Enemy.js';


export class Itay extends Enemy {
    constructor(game){
        super(game);
        this.lives = 2;
        this.score = this.lives;
        this.height = 170;
        this.y = Math.random() * (this.game.height * 0.95 - this.height); // adjust the spawning height of enemy
        this.image = document.getElementById('itayFly');
        this.maxFrame = 0;

        if (this.y > 210){ /* check for if the enemy spawns on the ground 
                            (210 being 500 (height of game) minus player height and height of floor (120))*/
            this.width = 86; //width of enemy image
            this.height = 170; //height of enemy image
            this.image = document.getElementById('itay');
            this.adjustX = 0; // adjustment of enemy image for when animations play
            this.adjustWidth = 0; // adjustment of enemy image for when animations play
            this.maxFrame = 4; // max frames of enemy animations
        } 
        else {
            this.width = 127; //width of enemy image
            this.height = 158; //height of enemy image
            this.image = document.getElementById('itayFly');
            this.adjustX = 0; // adjustment of enemy image for when animations play
            this.adjustWidth = 0; // adjustment of enemy image for when animations play
            this.maxFrame = 0; // max frames of enemy animations
        }
    }
    
}