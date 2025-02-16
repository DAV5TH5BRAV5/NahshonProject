export class Enemy {
    constructor(game){
        this.game = game;
        this.x = this.game.width / 2 - 50;
        this.speedX = Math.random() * -0.375 -0.375;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 7;
        this.frameTimer = 0; // Track time between frame updates
        this.frameInterval = 100;  
        this.adjustHeight = 0;
        
        //Hit effect
        this.hitTimer = 0;
        this.hitDuration = 200; //Duration
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

        if (this.hitTimer > 0) {
            this.hitTimer -= deltaTime;
        }
    }
    draw(context){
        if (this.speedX < 0) {
            context.save();
            context.scale(-1, 1);  // Flip horizontally
            context.drawImage(this.image, this.frameX * this.width + this.adjustX, this.frameY * this.height  + this.adjustHeight, this.width + this.adjustWidth, this.height, -this.x - this.width, this.y, this.width, this.height);
            context.restore();
        }
        else {
            context.drawImage(this.image, this.frameX * this.width + this.adjustX, this.frameY * this.height  + this.adjustHeight, this.width + this.adjustWidth, this.height, this.x, this.y, this.width, this.height);
        }

        if (this.hitTimer > 0) {
            const offScreenCanvas = document.createElement('canvas');
            offScreenCanvas.width = this.width;
            offScreenCanvas.height = this.height;
            const offScreenContext = offScreenCanvas.getContext('2d');

            offScreenContext.drawImage(
                this.image,
                this.frameX * this.width + this.adjustX,
                this.frameY * this.height + this.adjustHeight,
                this.width + this.adjustWidth,
                this.height,
                0,
                0,
                this.width,
                this.height
            );

            const imageData = offScreenContext.getImageData(0, 0, this.width, this.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];  
                if (alpha > 0) {  
                    data[i] = 255;  
                    data[i + 1] = 0;  
                    data[i + 2] = 0; 
                    data[i + 3] = Math.min(data[i + 3], 255 * (this.hitTimer / this.hitDuration));
                }
            }

            offScreenContext.putImageData(imageData, 0, 0);

            if (this.speedX < 0) {
                context.save();
                context.scale(-1, 1); 
                context.drawImage(offScreenCanvas, -this.x - this.width, this.y);
                context.restore();
            } else {
                context.drawImage(offScreenCanvas, this.x, this.y);
            }
        }

    }

    hit() {
        this.hitTimer = this.hitDuration;
    }
}