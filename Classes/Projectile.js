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
        if (isEnemy) { // if this projectile belongs to an enemy
            this.image = document.getElementById('keva');
            this.width = 50;
            this.height = 70;
        }
        else {
            switch (this.id) {
                case 1: // if this player is Eli
                    this.image = document.getElementById('sword');
                    this.width = 70;
                    this.height = 25;
                    break;
                case 2: // if this player is Shai
                    this.image = document.getElementById('shatz');
                    this.width = 100;
                    this.height = 100;
                    break;
                case 3: // if this player is Ron
                    this.image = document.getElementById('soldierBoot');
                    this.width = 30;
                    this.height = 29;
                    break;
                default: // if this player is Ticket Master
                    this.image = document.getElementById('foodTicket');
                    this.width = 69;
                    this.height = 45;
                    break;
            }            

        }
        if (isEnemy) this.y = Math.random() * this.game.height - this.height; /* if belongs to an enemy
                                                                                 make its y random */
        if (this.y < 0) this.y = -this.height; // makes sure bullet spawns in game area
        else if (this.y > this.game.height) this.y = this.height; // makes sure bullet spawns in game area

    }
    update(isEnemy, isEnd){ /*note: next if statement is to check if the bullet belongs to an enemy OR
                            the end game is playing to make sure the players are able to shoot each other*/
        if (isEnemy || isEnd){ // if bullet belongs to an enemy or the end game is playing
            if (this.speed > 0){ // check direction of bullet (to player 1 or player 2)
                this.x += this.speed; // move bullet
                if (this.x > this.game.width) this.markedForDeletion = true; // delete bullet if outside
            }
            else {
                this.x += this.speed; // move bullet
                if (this.x < this.game.width * 0) this.markedForDeletion = true;// delete bullet if outside
            }                
        }

        else { // if the bullet is from the player and its not the end game
            if (this.speed > 0){ // check direction of bullet (to player 1 or player 2)
                this.x += this.speed; // move bullet
                if (this.x > this.game.width * 0.38) this.markedForDeletion = true; // delete bullet if outside
            }
            else {
                this.x += this.speed; // move bullet
                if (this.x < this.game.width * 0.58) this.markedForDeletion = true; // delete bullet if outside
            }
        }
    }
    draw(context, speed = this.speed, shouldSwitch = this.shouldSwitch){
        // determine if the bullet is going to p2 or if the image can be switched
        if (speed < 0 || !shouldSwitch) context.drawImage(this.image, this.x, this.y);
        else if (shouldSwitch){ // else if this image should be switched
            context.save();
            context.scale(-1, 1);  // Flip horizontally
            context.drawImage(this.image, -this.x - this.width, this.y); // draw it with right pos
            context.restore();
        } 
    }
}