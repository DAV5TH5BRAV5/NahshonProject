import { Enemy } from './Enemy.js';

export class Yotam extends Enemy {
    constructor(game){
        super(game);
        this.lives = 3;
        this.score = 15;
        this.height = 185;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('yotam');
        this.type = 'lucky';
        this.maxFrame = 0;

        if (this.y > 195){
            this.width = 117;
            this.height = 185;
            this.frameY = 0;
            this.adjustX = 0;
            this.adjustWidth = 0;
            this.maxFrame = 7;
        } 
        else {
            this.width = 63;
            this.height = 223;
            this.frameY = 1;
            this.adjustHeight = -38;
            this.adjustX = 0;
            this.adjustWidth = 0;
            this.maxFrame = 8;
        }
    }
}