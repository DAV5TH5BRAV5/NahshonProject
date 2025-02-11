export class InputHandler {
    constructor(game){
        this.game = game;
        this.keys = {
            shootPlayer1: false,
            shootPlayer2: false,
            eventTrigger1: false,
            eventTrigger2: false
        };
        this.eventTriggered = false;
        this.lastShotTimePlayer1 = 0;
        this.lastShotTimePlayer2 = 0;
        this.shootCooldown = 100;  // 500ms cooldown between shots
        
        window.addEventListener('keydown', e => {
            if( ( (e.key === 'ArrowUp') || 
                    (e.key ==='ArrowDown') || 
                    (e.key ==='w') || 
                    (e.key ==='s')) && this.game.keys.indexOf(e.key) === -1){
                this.game.keys.push(e.key);
            }
            // Shooting keys (e for player1, space for player2)
            if (e.key === 'e' && !this.keys.shootPlayer1) {
                this.keys.shootPlayer1 = true;
            } else if (e.key === ' ' && !this.keys.shootPlayer2) {
                this.keys.shootPlayer2 = true;
            }
            
            // Event trigger keys (g for player1, h for player2)
            if (e.key === 'g') {
                this.keys.eventTrigger1 = true;
            } else if (e.key === 'h') {
                this.keys.eventTrigger2 = true;
            }
        });

        window.addEventListener('keyup', e =>{
            if (this.game.keys.indexOf(e.key) > -1){
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
            }
            if (e.key === 'e') {
                this.keys.shootPlayer1 = false;
            } else if (e.key === ' ') {
                this.keys.shootPlayer2 = false;
            }
            if (e.key === 'g') {
                this.keys.eventTrigger1 = false;
            } else if (e.key === 'h') {
                this.keys.eventTrigger2 = false;
            }
        });
    }

    enableEventListeners() {
        if (!this.eventTriggered) {
            window.addEventListener('keydown', this.handleEventTrigger);
            this.eventTriggered = true;
        }
    }

    handleEventTrigger = () => {
        if (this.game.eventActive && !this.game.eventWinner) {
            let tempRand = Math.floor(Math.random() * 3);
            if (this.keys.eventTrigger1) {
                if (tempRand === 0) {
                    this.game.triggerAttack(this.game.player1, this.game.player2);
                } else if (tempRand === 1) {
                    this.game.triggerRestriction(this.game.player1, this.game.player2);
                } else {
                    this.game.triggerBouncing(this.game.player1, this.game.player2);
                }
            } else if (this.keys.eventTrigger2) {
                if (tempRand === 0) {
                    this.game.triggerAttack(this.game.player2, this.game.player1);
                } else if (tempRand === 1) {
                    this.game.triggerRestriction(this.game.player2, this.game.player1);
                } else {
                    this.game.triggerBouncing(this.game.player2, this.game.player1);
                }
            }
            window.removeEventListener('keydown', this.handleEventTrigger);
            this.eventTriggered = false;
        }
    }

    update() {
        // Continuously check for shooting keys being held down
        const currentTime = Date.now();

        // Check if player 1 can shoot (based on cooldown)
        if (this.keys.shootPlayer1 && currentTime - this.lastShotTimePlayer1 >= this.shootCooldown) {
            this.game.player1.shootTop(3, this.game.player1.isEnd);  // Player 1 shoots
            this.lastShotTimePlayer1 = currentTime;  // Update last shot time for player 1
        }

        // Check if player 2 can shoot (based on cooldown)
        if (this.keys.shootPlayer2 && currentTime - this.lastShotTimePlayer2 >= this.shootCooldown) {
            this.game.player2.shootTop(-3, this.game.player2.isEnd);  // Player 2 shoots
            this.lastShotTimePlayer2 = currentTime;  // Update last shot time for player 2
        }

        // Check for event triggers while updating
        if (this.game.eventActive && !this.game.eventWinner) {
            this.handleEventTrigger();
        }
    }
}