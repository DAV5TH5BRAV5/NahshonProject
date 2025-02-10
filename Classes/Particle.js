export class Particle {
    constructor(game, x, y){
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = document.getElementById('sonic');
        this.size = 25;
        this.speedX = Math.random() * 6 -3;
        this.speedY = Math.random() - 15;
        this.gravity = 0.5;
        this.markedForDeletion = false;
        this.angle = 0;
        this.bounced = 0;
        this.bottomBounceBoundary = Math.random() * 100 + 60;

    }
    update(){
        this.speedY += this.gravity;
        this.x -= this.speedX;
        this.y += this.speedY;
        if (this.y > this.game.height + this.size || this.x < - this.size) this.markedForDeletion = true;
        if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 2){
            this.bounced ++;
            this.speedY *= -0.65;
        }
    }
    draw(context){
        context.save();
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
        context.restore();
    }
}