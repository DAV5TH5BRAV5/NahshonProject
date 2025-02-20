export class Layer {
    constructor(game, image, speedModifier, x){
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1768;
        this.height = 500;
        this.x = x;
        this.y = 0;
    }
    update(){
        if (this.x <= -this.width) this.x = 0; // if layer went beyond the screen reset its position
        else if (this.x >= this.width) this.x = 0; // if layer went beyond the screen reset its position
        this.x -= this.game.speed * this.speedModifier; // move the image
    }

    draw(context, playerNum){
        context.drawImage(this.image, this.x, this.y);
        switch (playerNum) {
            case 1: // if first player
                context.drawImage(this.image, this.x + this.width, this.y);
                break;
            case 2: // if 2nd player
                context.drawImage(this.image, this.x - this.width, this.y);
                break;
        }
    }
}