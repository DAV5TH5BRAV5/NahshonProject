export class Enemy {
    constructor(game){
        this.game = game;
        this.x = this.game.width / 2 - 50;
        this.speedX = Math.random() * -0.375 -0.375;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 7;
        this.frameTimer = 0;  // Track time between frame updates
        this.frameInterval = 100;  
    }
    update(deltaTime){
        if (this.speedX < 0){
            this.x += this.speedX - this.game.speed / 4;
        }
        else{
            this.x += this.speedX + this.game.speed / 4; 
        }
        if (this.x + this.width < 0) this.markedForDeletion = true;

        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;  // Reset timer
        }
    }
    draw(context){
        context.strokeRect(this.x, this.y, this.width, this.height);
        if (this.speedX < 0) {
            context.save();
            context.scale(-1, 1);  // Flip horizontally
            context.drawImage(this.image, this.frameX * this.width + this.adjustX, this.frameY * this.height, this.width + this.adjustWidth, this.height, -this.x - this.width, this.y, this.width, this.height);
            context.fillStyle = 'black';
            context.font = '20px Helvetica';
            context.fillText(this.lives, -this.x - this.width, this.y);
            context.restore();
        }
        else {
            context.drawImage(this.image, this.frameX * this.width + this.adjustX, this.frameY * this.height, this.width + this.adjustWidth, this.height, this.x, this.y, this.width, this.height);
            context.fillStyle = 'black';
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y);
        }

    }
}