export class Enemy {
    constructor(game){
        this.game = game;
        this.x = this.game.width / 2 - 50;
        this.speedX = Math.random() * -0.375 -0.375;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 7; // default max frames for animation
        this.frameTimer = 0; // Track time between frame updates
        this.frameInterval = 100;  
        this.adjustHeight = 0;
        
        //Hit effect
        this.hitTimer = 0; // how long has the current hit effect been going
        this.hitDuration = 200; //Duration
    }
    update(deltaTime){
        if (this.speedX < 0){ // to determine if enemy is going to player 1 or player 2 
            this.x += this.speedX - this.game.speed / 4; /* move enemy by his speed and the speed of 
                                                          game divided by the speed the game is moving */
        }
        else{
            this.x += this.speedX + this.game.speed / 4; /* move enemy by his speed and the speed of 
                                                          game divided by the speed the game is moving */
        }
        if (this.x + this.width < 0) this.markedForDeletion = true; // if enemy went off screen mark to delete

        this.frameTimer += deltaTime; // keep track of how long ago the last frame change was
        if (this.frameTimer > this.frameInterval) { /* if the time from last frame change is longer than
                                                      the max frameInterval set than change the frame */
            if (this.frameX < this.maxFrame) this.frameX++; // change frame if we haven't reached end
            else this.frameX = 0; // reset to the first frame if we reached end of animation
            this.frameTimer = 0;  // Reset timer
        }

        if (this.hitTimer > 0) { // keep track of the last time enemy was hit
            this.hitTimer -= deltaTime;
        }
    }
    draw(context){
        if (this.speedX < 0) { // to determine if enemy is going to player 1 or player 2 
            context.save();
            context.scale(-1, 1);  // Flip horizontally
            context.drawImage(this.image, // set the image
                 this.frameX * this.width + this.adjustX, // set the X frame with adjustments
                  this.frameY * this.height  + this.adjustHeight, // set the Y frame with adjustments
                   this.width + this.adjustWidth, // set the MAX width with adjustments
                    this.height, // set the MIN height
                     -this.x - this.width, // set the X position of enemy
                      this.y, // set the Y position of enemy
                       this.width, // set the width
                       this.height); // set the height
            context.restore();
        }
        else {
            context.drawImage(this.image,
                 this.frameX * this.width + this.adjustX, // set the X frame with adjustments
                  this.frameY * this.height  + this.adjustHeight, // set the Y frame with adjustments
                   this.width + this.adjustWidth, // set the MAX width with adjustments
                    this.height, // set the MIN height
                    this.x, // set the X position of enemy
                     this.y, // set the Y position of enemy
                      this.width, // set the width
                       this.height); // set the height
        }

        if (this.hitTimer > 0) { // if the enemy was hit
            this.drawRedHit(context); // draw the enemy red
        }

    }

    hit() { // when hit
        this.hitTimer = this.hitDuration;
    }

    drawRedHit(context) {
        const offScreenCanvas = document.createElement('canvas'); //create new canvas
        offScreenCanvas.width = this.width; //set its width as same as this canvas's width
        offScreenCanvas.height = this.height; //set its heigh as same as this canvas's height
        const offScreenContext = offScreenCanvas.getContext('2d');

        offScreenContext.drawImage(
            this.image,
            this.frameX * this.width + this.adjustX, // adjust red according to this frame
            this.frameY * this.height + this.adjustHeight, // adjust red according to this frame
            this.width + this.adjustWidth, // adjust red according to this frame
            this.height, // adjust red according to this frame
            0, // X
            0, // Y
            this.width,  
            this.height
        );

        const imageData = offScreenContext.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;

        // sets the image to be red when hit
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];  
            if (alpha > 0) {  
                data[i] = 255; // 255 for red effect (first number in rgb)
                data[i + 1] = 0; // 0 for green in rgb
                data[i + 2] = 0; // 0 for blue in rgb
                // make the red effect gradual
                data[i + 3] = Math.min(data[i + 3], 255 * (this.hitTimer / this.hitDuration));
            }
        }

        offScreenContext.putImageData(imageData, 0, 0);

        if (this.speedX < 0) { // determine if the enemy is heading to p1 or p2
            context.save();
            context.scale(-1, 1); 
            context.drawImage(offScreenCanvas, -this.x - this.width, this.y);
            context.restore();
        } else {
            context.drawImage(offScreenCanvas, this.x, this.y);
        }
    }
}