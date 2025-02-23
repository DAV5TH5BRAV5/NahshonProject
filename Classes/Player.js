import { Projectile } from './Projectile.js';

export class Player {
    constructor(game, x, y, isEnd = false, canShoot = true){
        this.game = game;
        this.width = 77; // default width of image
        this.height = 160; // default height of image
        this.x = x;
        this.y = y;
        this.speedY = 0;
        this.maxSpeed = 1;
        this.projectiles =[];
        this.ammo = 20;
        this.ammoTimer = 0; // how long since last shot
        this.ammoInterval = 500; // how long between each shot
        this.maxAmmo = 30;
        this.score = 0;
        this.winningScore = 10;
        this.powerUp = false;
        this.powerUpTimer = 0;
        this.powerupLimit = 10000;
        this.lives = 50;
        this.isEnd = isEnd;
        this.canShoot = canShoot;
        this.tempAmmo = 0; // keeps track of ammo as temp place holder when reseting ammo

        //frames
        this.image = document.getElementById('player');
        this.frameX = 0; // keeps track of current frame
        this.frameY = 0; // keeps track of current frame
        this.maxFrame = 4; // keeps track max frames
        this.frameTimer = 0; // Track time between frame updates
        this.frameInterval = 100; // how long to take between each frame
        this.adjustX = 0; // adjust the image if needed
        this.adjustWidth = 0; // adjust the image if needed
        this.adjustHeight = 0; // adjust the image if needed
        this.id = 0; // id of player to keep track of which character player chose

        //Sounds
        this.shootingSound = new Audio('./assets/sounds/cardThrowSound.mp3');
        this.shootingSoundPlaying = false;

        //Hit effect
        this.hitTimer = 0;
        this.hitDuration = 200; //Duration

        //winning
        this.winningImage = new Image();
        this.winningImage.src = './assets/winningImages/winningImageEli.png';
        this.winningSoundPlayed = false; // Make sure its only played once
        this.winningSound = new Audio('./assets/sounds/winningSoundGeneral.mp3');

        //controller Vibrate Allower
        this.allowControllerVibrate = true;
    }
    update(key1, key2, deltaTime, isEnd = false, canShoot){
        if (!canShoot) { // if the player can't shoot because of animation
            if (this.ammo != 0) this.tempAmmo = this.ammo;
            this.ammo = 0;
            this.maxAmmo = 0;
            this.powerUp = false;
        }
        else{ // if the player can shoot
            this.maxAmmo = 30;
            if (this.tempAmmo != 0){ // reset the tempAmmo so it can be used again
                this.ammo = this.tempAmmo;
                this.tempAmmo = 0;
            } 
        } 
    
        if(this.game.keys.includes(key1)) this.speedY = -this.maxSpeed; // when pressing move buttons
        else if(this.game.keys.includes(key2)) this.speedY = this.maxSpeed; // when pressing move buttons
        else this.speedY = 0; // when NOT pressing move buttons
        this.y += this.speedY; // move the player
        if(this.y > this.game.height - this.height * 0.5) // if the player goes under the screen halfway
             this.y = this.game.height - this.height * 0.5; // dont let him go any more under
        else if(this.y < 0) this.y = 0; // if he tries going above don't let him move any more up

        //projectiles
        this.projectiles.forEach(projectile =>{
            projectile.update(false, isEnd);
        });
        // delete projectiles meant for deletion
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

        //power up
        if (this.powerUp){
            if (this.powerUpTimer > this.powerupLimit || this.isEnd){
                this.powerUpTimer = 0;
                this.powerUp = false;
            }
            else {
                this.powerUpTimer += deltaTime;
                if (this.ammo < this.maxAmmo + 20) this.ammo += 0.1; // increase ammo by shit ton
            }
        }


        this.frameTimer += deltaTime; // keep track of how long since last frame change
        if (this.frameTimer > this.frameInterval) { // if its time to change frames
            if (this.frameX < this.maxFrame) // if another frame is available
                 this.frameX++; // change the damn frame
            else if (this.id == 2 && this.powerUp) // if its shai and he is in powerup state
                 this.frameX = 3;  //change his starting frame to 3 to make animation smooth
            else this.frameX = 0; // if there are no more frames then reset the frames

            // reset the animation if we have reached the end
            switch (this.id) { // Eli
                case 1:
                    if (this.frameY == 1 && this.frameX == this.maxFrame) {
                        this.frameY = 0;
                        this.frameX = 0;
                        this.maxFrame = 4;
                        this.frameInterval = 150;
                        this.adjustWidth = 0;
                        this.adjustHeight = 0;
                    }
                    break;
            
                case 2: // Shai
                    if (this.powerUp && this.frameX == this.maxFrame) { // for continous special ability animation
                        this.frameY = 2;
                        this.frameX = 0;
                        this.maxFrame = 9;
                        this.frameInterval = 70;
                        this.adjustWidth = 119;
                        this.adjustHeight = 29;
                    } else if (!this.powerUp && this.frameY == 2) { // for end of special ability animation
                        this.frameY = 0;
                        this.frameX = 0;
                        this.maxFrame = 5;
                        this.frameInterval = 125;
                        this.adjustWidth = 0;
                        this.adjustHeight = 0;
                    } else if (this.frameY == 1 && this.frameX == this.maxFrame) { // for end of animation
                        this.frameY = 0;
                        this.frameX = 0;
                        this.maxFrame = 5;
                        this.frameInterval = 125;
                        this.adjustWidth = 0;
                        this.adjustHeight = 0;
                    }
                    break;
            
                case 3: // Eli
                    if (this.frameY == 1 && this.frameX == this.maxFrame) {
                        this.frameY = 0;
                        this.frameX = 0;
                        this.maxFrame = 4;
                        this.frameInterval = 125;
                        this.adjustWidth = 0;
                        this.adjustHeight = 0;
                    }
                    break;
            
                case 4: // Card Master
                    if (this.frameY == 1 && this.frameX == this.maxFrame) {
                        this.frameY = 0;
                        this.frameX = 0;
                        this.maxFrame = 9;
                        this.frameInterval = 100;
                        this.adjustWidth = 0;
                        this.adjustHeight = 0;
                    }
                    break;
            }
            
            this.frameTimer = 0;  // Reset timer
        }
        if (this.hitTimer > 0) {
            this.hitTimer -= deltaTime;
        }

    }
    draw(context){
        this.projectiles.forEach(projectile =>{
            projectile.draw(context);
        });
        if (this.x > 500) { // if its the second player
            context.save();
            context.scale(-1, 1);  // Flip horizontally
            if (this.id == 2 && this.x > 500 && this.powerUp) // if its shai and he is p2 and in powerup
                 context.drawImage(this.image,
                                    this.frameX * (this.width + this.adjustWidth), //adjust image frame
                                     this.frameY * this.height + this.adjustHeight, //adjust image frame
                                      this.width + this.adjustWidth, //adjust image MAX width
                                       this.height + this.adjustHeight, //adjust image MAX height
                                       -this.x - this.width - 50, //adjust image X
                                         this.y, // image Y
                                          this.width + this.adjustWidth, //adjust image width
                                           this.height); //adjust image height
            
            else context.drawImage(this.image,
                                     this.frameX * (this.width + this.adjustWidth), //adjust image frame
                                      this.frameY * this.height + this.adjustHeight, //adjust image frame
                                       this.width + this.adjustWidth, //adjust image MAX width
                                        this.height + this.adjustHeight, //adjust image MAX height
                                         -this.x - this.width, //adjust image X
                                          this.y, // image Y
                                           this.width + this.adjustWidth, //adjust image width
                                            this.height); //adjust image height
            context.restore();
        }
        else { // if its the first player
            if (this.id == 2 && this.x > 500 && this.powerUp)
                 context.drawImage(this.image,
                 this.frameX * (this.width + this.adjustWidth), //adjust image frame
                  this.frameY * this.height + this.adjustHeight, //adjust image frame
                   this.width + this.adjustWidth, //adjust image MAX width
                    this.height, //adjust image MAX height
                     this.x - this.width / 2, // adjust image X so he fits with animation 
                      this.y, // image Y
                       this.width + this.adjustWidth, //adjust image width
                        this.height); //adjust image height
            
            
            else context.drawImage(this.image,
                 this.frameX * (this.width + this.adjustWidth), //adjust image frame
                  this.frameY * this.height + this.adjustHeight, //adjust image frame
                   this.width + this.adjustWidth, //adjust image MAX width
                    this.height, //adjust image MAX height
                     this.x, // adjust image X so he fits with animation 
                      this.y, // image Y
                       this.width + this.adjustWidth, //adjust image width
                        this.height); //adjust image height
        }

        if (this.hitTimer > 0) { // if was hit
            this.drawRedHit(context);
        }
    }
    shootTop(speed, isEnd = false){
        if (this.ammo > 0 && speed > 0){ // if player has ammo and determine if he is p1
            this.allowControllerVibrate = true; // for controller vibrations
            if (this.id == 2 || this.id == 4) // if its Shai or The Card Master
                 this.projectiles.push(new Projectile(this.game, // current game
                                                       this.x + 80, // adjust projectile to be infront p1
                                                        this.y + 30, // make it higher to look better
                                                         speed, // speed of projectile (duh)
                                                          false, // defines it non enemy projectile
                                                           isEnd, // if its the end game
                                                            this.id, // unique player id
                                                             false)); // if can mirror the image

            else this.projectiles.push(new Projectile(this.game, // current game
                                                       this.x + 80, // adjust projectile to be infront p1
                                                        this.y + 30, // make it higher to look better
                                                         speed, // speed of projectile (duh)
                                                          false, // defines it non enemy projectile
                                                           isEnd, // if its the end game
                                                            this.id)); // unique player id
            this.ammo--; // lower current ammo by 1


        }
        else if (this.ammo > 0 && speed < 0){ // if player has ammo and he is p2
            if (this.id == 2 || this.id == 4)
                 this.projectiles.push(new Projectile(this.game, // current game
                                                       this.x - 80, // adjust projectile to be infront p2
                                                        this.y + 30, // make it higher to look better
                                                         speed, // speed of projectile (duh)
                                                          false, // defines it non enemy projectile
                                                           isEnd, // if its the end game
                                                            this.id, // unique player id
                                                             false)); // if can mirror the image
            
            else this.projectiles.push(new Projectile(this.game, // current game
                                                       this.x - 80, // adjust projectile to be infront p2
                                                        this.y + 30, // make it higher to look better
                                                         speed, // speed of projectile (duh)
                                                          false, // defines it non enemy projectile
                                                           isEnd, // if its the end game
                                                            this.id)); // unique player id
            this.ammo--;  
        }
        switch (this.id) {
            // resets the shooting animation 
            case 1: // Eli
                if (this.frameY !== 1) { // if he isn't already in shooting animation
                    this.frameY = 1;
                    this.frameX = 0;
                    this.maxFrame = 6;
                    this.frameInterval = 75;
                    this.adjustWidth = 69;
                    this.adjustHeight = 30;
                }
                break;
        
            case 2: // Shai
                if (this.frameY !== 1 && !this.powerUp) { // if he isn't already in shooting animation or power up
                    this.frameY = 1;
                    this.frameX = 0;
                    this.maxFrame = 9;
                    this.frameInterval = 65;
                    this.adjustWidth = 49;
                    this.adjustHeight = 0;
                }
                break;
        
            case 3: // Ron
                if (this.frameY !== 1) { // if he isn't already in shooting animation
                    this.frameY = 1;
                    this.frameX = 0;
                    this.maxFrame = 11;
                    this.frameInterval = 55;
                    this.adjustWidth = 45;
                    this.adjustHeight = 0;
                }
                break;
        
            case 4: // Card Master
                if (this.frameY !== 1) { // if he isn't already in shooting animation
                    this.frameY = 1;
                    this.frameX = 0;
                    this.maxFrame = 9;
                    this.frameInterval = 75;
                    this.adjustWidth = 11;
                    this.adjustHeight = 0;
                }
                break;
        }
        
        // Play shooting sound if it's not already playing
        if (!this.shootingSoundPlaying) {
            this.shootingSound.play();
            this.shootingSoundPlaying = true;
            this.shootingSound.onended = () => {
                this.shootingSoundPlaying = false;
            };
        }
        else if (this.ammo <= 0) // if player doesn't have ammo
             this.allowControllerVibrate = false; // don't vibrate controller (or sex device)
        if (this.powerUp) this.shootBottom(speed); // if player in powerup state shoot another bullet
    }
    shootBottom(speed, isEnd = false){ // handle shooting bottom for power up state
        if (this.ammo > 0 && speed > 0){ // if player has ammo and is p1
            if (this.id == 2) // if its Shai
                this.projectiles.push(new Projectile(this.game, // current game
                                                      this.x + 80, // adjust projectile to be infront p1
                                                       this.y + 100, // make it higher to look better
                                                        speed, // speed of projectile (duh)
                                                         false, // defines it non enemy projectile
                                                          isEnd, // if its the end game
                                                           this.id, // unique player id
                                                            false)); // if can mirror the image
            
            else this.projectiles.push(new Projectile(this.game, // current game
                                                       this.x + 80, // adjust projectile to be infront p1
                                                        this.y + 100, // make it higher to look better
                                                         speed, // speed of projectile (duh)
                                                          false, // defines it non enemy projectile
                                                           isEnd, // if its the end game
                                                            this.id)); // unique player id
            
        }
        else if (this.ammo > 0 && speed < 0){ // if player has ammo and is p2
            if (this.id == 2) // if its Shai
                 this.projectiles.push(new Projectile(this.game, // current game
                                                       this.x - 80, // adjust projectile to be infront p2
                                                        this.y + 100, // make it higher to look better
                                                         speed, // speed of projectile (duh)
                                                          false, // defines it non enemy projectile
                                                           isEnd, // if its the end game
                                                            this.id, // unique player id
                                                             false)); // if can mirror the image
            
            else this.projectiles.push(new Projectile(this.game, // current game
                                                       this.x - 80, // adjust projectile to be infront p2
                                                        this.y + 100, // make it higher to look better
                                                         speed, // speed of projectile (duh)
                                                          false, // defines it non enemy projectile
                                                           isEnd, // if its the end game
                                                            this.id)); // unique player id

        }
    }
    enterPowerUp(){
        this.powerUpTimer = 0;
        this.powerUp = true;
        if (this.ammo < this.maxAmmo) this.ammo = this.maxAmmo; // sets ammo as Max ammo when powerup
    }

    hit() {
        this.hitTimer = this.hitDuration;
    }
    drawRedHit(context) {
        const offScreenCanvas = document.createElement('canvas'); //create new canvas
        offScreenCanvas.width = this.width + this.adjustWidth; //set its width as same as this canvas's width with adjustment
        offScreenCanvas.height = this.height; //set its heigh as same as this canvas's height
        const offScreenContext = offScreenCanvas.getContext('2d');

        offScreenContext.drawImage(
            this.image, 
            this.frameX * (this.width + this.adjustWidth), // adjust red according to this frame
            this.frameY * this.height + this.adjustHeight, // adjust red according to this frame
            this.width + this.adjustWidth, // adjust red according to this frame
            this.height, // adjust red according to this frame
            0, // X
            0, // Y
            this.width + this.adjustWidth, // adjust width
            this.height
        );

        const imageData = offScreenContext.getImageData(0,
                                                         0,
                                                          this.width + this.adjustWidth, // adjust width
                                                           this.height);
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

        if (this.x > 500) { // determine if the player is p2
            context.save();
            context.scale(-1, 1);
            context.drawImage(offScreenCanvas, -this.x - this.width, this.y);
            context.restore();
        } else {
            context.drawImage(offScreenCanvas, this.x, this.y);
        }
    }
}