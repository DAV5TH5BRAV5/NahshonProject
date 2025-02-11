import { Enemy } from './Enemy.js';

export class Alex extends Enemy {
    constructor(game){
        super(game);
        this.lives = 4;
        this.score = this.lives;
        this.height = 190;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        if (this.y > 190){
            this.width = 73;
            this.height = 190;
            this.image = document.getElementById('alex');
            this.adjustX = 7;
            this.adjustWidth = -9;
            this.maxFrame = 7;
        } 
        else {
            this.width = 190;
            this.height = 73;
            this.image = document.getElementById('alexFly');
            this.adjustX = 0;
            this.adjustWidth = 0;
            this.maxFrame = 0;
        }


    }
}