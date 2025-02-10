export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Bangers';
        this.color = 'white';
    }
    draw(context, isEnd = false){
        context.save();
        context.fillStyle = this.color;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.font = this.fontSize + 'px ' + this.fontFamily;
        if (!isEnd){
            //score draw
            context.fillText('Score: ' + this.game.player1.score, 20, 40);
            context.fillText('Score: ' + this.game.player2.score, 850, 40);


            //timer draw
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: ' + formattedTime, 20, 100);
            context.fillText('Timer: ' + formattedTime, 850, 100);

            //ammo draw 
            if (this.game.player1.powerUp) context.fillStyle = 'yellow';
            for (let i = 0; i < this.game.player1.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            context.fillStyle = this.color;
            if (this.game.player2.powerUp) context.fillStyle = 'yellow';
            for (let i = 0; i < this.game.player2.ammo; i++){
                context.fillRect(850 + 5 * i, 50, 3, 20);
            }
            context.restore();
        }
        else {
            //score draw
            context.fillText('Lives: ' + this.game.player1.lives, 20, 40);
            context.fillText('Lives: ' + this.game.player2.lives, 850, 40);

            //ammo draw 
            if (this.game.player1.powerUp) context.fillStyle = 'yellow';
            for (let i = 0; i < this.game.player1.ammo; i++){
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            context.fillStyle = this.color;
            if (this.game.player2.powerUp) context.fillStyle = 'yellow';
            for (let i = 0; i < this.game.player2.ammo; i++){
                context.fillRect(850 + 5 * i, 50, 3, 20);
            }
            context.restore();
        }

    }
    
}