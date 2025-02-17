export class Projectile {
    constructor(game, x, y, speed, isEnemy = false, isEnd = false, id = 0, shouldSwitch = true) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.isEnemy = isEnemy;
        this.speed = speed;
        this.markedForDeletion = false;
        this.id = id;
        this.shouldSwitch = shouldSwitch;
        if (isEnemy) {
            this.image = document.getElementById('keva');
            this.width = 50;
            this.height = 70;
        }
        else {
            if (this.id == 1) {
                this.image = document.getElementById('sword');
                this.width = 70;
                this.height = 25;
                
            }
            else if (this.id == 2){
                this.image = document.getElementById('shatz');
                this.width = 100;
                this.height = 100;
            }
            else if (this.id == 3){
                this.image = document.getElementById('soldierBoot');
                this.width = 30;
                this.height = 29;
            }
            else {
                this.image = document.getElementById('foodTicket');
                this.width = 69;
                this.height = 45;  
            }

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
                if (this.x > this.game.width * 0.38) this.markedForDeletion = true;
            }
            else {
                this.x += this.speed;
                if (this.x < this.game.width * 0.58) this.markedForDeletion = true;  
            }
        }
    }
    draw(context, speed = this.speed, shouldSwitch = this.shouldSwitch){
        if (speed < 0 || !shouldSwitch) context.drawImage(this.image, this.x, this.y);
        else if (shouldSwitch){
            context.save();
            context.scale(-1, 1);  // Flip horizontally
            context.drawImage(this.image, -this.x - this.width, this.y);
            context.restore();
        } 



    }

}