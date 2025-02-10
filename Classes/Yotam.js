import { Enemy } from './Enemy.js';

export class Yotam extends Enemy {
    constructor(game){
        super(game);
        this.lives = 3;
        this.score = 15;
        this.width = 120;
        this.height = 190;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('yotam');
        this.type = 'lucky';
    }
}