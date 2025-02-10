export class Enemy {
    constructor(game){
        this.game = game;
        this.x = this.game.width / 2 - 50;
        this.speedX = Math.random() * -0.375 -0.375;
        this.markedForDeletion = false;

    }
    update(){
        if (this.speedX < 0){
            this.x += this.speedX - this.game.speed / 4;
        }
        else{
            this.x += this.speedX + this.game.speed / 4; 
        }
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y);
        context.fillStyle = 'black';
        context.font = '20px Helvetica';
        context.fillText(this.lives, this.x, this.y);
    }
}