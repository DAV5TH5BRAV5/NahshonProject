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
        if (this.x <= -this.width) this.x = 0;
        else if (this.x >= this.width) this.x = 0;
        this.x -= this.game.speed * this.speedModifier;
    }

    draw(context, playerNum){
        context.drawImage(this.image, this.x, this.y);

        if (playerNum == 1){
            context.drawImage(this.image, this.x + this.width, this.y);
        }
        else if (playerNum == 2){
            context.drawImage(this.image, this.x -this.width, this.y);
        }

    }

}