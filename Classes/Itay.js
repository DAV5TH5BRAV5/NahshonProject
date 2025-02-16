import { Enemy } from './Enemy.js';


export class Itay extends Enemy {
    constructor(game){
        super(game);
        this.lives = 2;
        this.score = this.lives;
        this.height = 170;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('itayFly');
        this.maxFrame = 0;

        if (this.y > 210){
            this.width = 86;
            this.height = 170;
            this.image = document.getElementById('itay');
            this.adjustX = 0;
            this.adjustWidth = 0;
            this.maxFrame = 4;
        } 
        else {
            this.width = 127;
            this.height = 158;
            this.image = document.getElementById('itayFly');
            this.adjustX = 0;
            this.adjustWidth = 0;
            this.maxFrame = 0;
        }
    }
}