import { Enemy } from './Enemy.js';

export class Liad extends Enemy {
    constructor(game){
        super(game);
        this.lives = 4;
        this.score = this.lives;
        this.width = 120;
        this.height = 190;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('liad');
    }
}