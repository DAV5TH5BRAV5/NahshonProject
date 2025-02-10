export class Projectile {
    constructor(game, x, y, speed, isEnemy = false, isEnd = false) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.isEnemy = isEnemy;
        this.speed = speed;
        this.markedForDeletion = false;
        if (isEnemy) {
            this.image = document.getElementById('keva');
            this.width = 50;
            this.height = 70;
        }
        else {
            this.image = document.getElementById('ptor');
            this.width = 37;
            this.height = 52;
        }
        if (isEnemy) this.y = Math.random() * this.game.height - this.height;
        if (this.y < 0) this.y = -this.height;
        else if (this.y > this.game.height) this.y = this.height;

    }
    update(isEnemy, isEnd){
        if (isEnemy || isEnd){
            if (this.speed > 0){
                this.x += this.speed;
                if (this.x > this.game.width * 1) this.markedForDeletion = true;
            }
            else {
                this.x += this.speed;
                if (this.x < this.game.width * 0) this.markedForDeletion = true;  
            }                
        }

        else {
            if (this.speed > 0){
                this.x += this.speed;
                if (this.x > this.game.width * 0.42) this.markedForDeletion = true;
            }
            else {
                this.x += this.speed;
                if (this.x < this.game.width * 0.58) this.markedForDeletion = true;  
            }
        }


    }
    draw(context){
        context.drawImage(this.image, this.x, this.y);
    }

}