import { Enemy } from './Enemy.js';

export class Yotam extends Enemy {
    constructor(game){
        super(game);
        this.lives = 3;
        this.score = 15;
        this.height = 185;
        this.y = Math.random() * (this.game.height * 0.95 - this.height); // adjust the spawning height of enemy
        this.image = document.getElementById('yotam');
        this.type = 'lucky';
        this.maxFrame = 0; 

        if (this.y > 195){ /* check for if the enemy spawns on the ground 
                            (195 being 500 (height of game) minus player height and height of floor (120))*/
            this.width = 117; //width of enemy image
            this.height = 185; //height of enemy image
            this.frameY = 0; // sets his animation to walking animation
            this.adjustX = 0; // adjustment of enemy image for when animations play
            this.adjustWidth = 0; // adjustment of enemy image for when animations play
            this.maxFrame = 7;
        } 
        else {
            this.width = 63; //width of enemy image
            this.height = 223; //height of enemy image
            this.frameY = 1; // sets his animation to flying animation
            this.adjustHeight = -38; // adjustment of enemy image for when animations play
            this.adjustX = 0; // adjustment of enemy image for when animations play
            this.adjustWidth = 0; // adjustment of enemy image for when animations play
            this.maxFrame = 8; // max frames of enemy animations
        }
        
    }
}