import { Enemy } from './Enemy.js';

export class Alex extends Enemy {
    constructor(game){
        super(game);
        this.lives = 4;
        this.score = this.lives;
        this.height = 190;
        this.y = Math.random() * (this.game.height * 0.95 - this.height); // adjust the spawning height of enemy
        if (this.y > 190){ /* check for if the enemy spawns on the ground 
                            (190 being 500 (height of game) minus player height and height of floor (120))*/
            this.width = 73; //width of enemy image
            this.height = 190; //height of enemy image
            this.image = document.getElementById('alex');
            this.adjustX = 7; // adjustment of enemy image for when animations play
            this.adjustWidth = -9; // adjustment of enemy image for when animations play
            this.maxFrame = 7; // max frames of enemy animations
        } 
        else {
            this.width = 190; //width of enemy image
            this.height = 73;//height of enemy image
            this.image = document.getElementById('alexFly');
            this.adjustX = 0; // adjustment of enemy image for when animations play
            this.adjustWidth = 0; // adjustment of enemy image for when animations play
            this.maxFrame = 0; // max frames of enemy animations
        }
    }
}