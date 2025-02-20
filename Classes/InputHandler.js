export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = {
            shootPlayer1: false,
            shootPlayer2: false,
            eventTrigger1: false,
            eventTrigger2: false
        };

        this.lastShotTimePlayer1 = 0;
        this.lastShotTimePlayer2 = 0;
        this.shootCooldown = 100; // 100ms cooldown

        this.player1GamepadIndex = null;
        this.player2GamepadIndex = null;

        window.addEventListener('gamepadconnected', (event) => {
            
            const isWired = event.gamepad.id.toLowerCase().includes("usb") || event.gamepad.id.toLowerCase().includes("wired");
            
            if (this.player1GamepadIndex === null) {
                this.player1GamepadIndex = event.gamepad.index;
            } else if (this.player2GamepadIndex === null) {
                this.player2GamepadIndex = event.gamepad.index;
            } else if (isWired) {
                // Prefer wired controllers over wireless ones
                this.player1GamepadIndex = event.gamepad.index;
                this.player2GamepadIndex = null; // Reset player 2 so next wired controller takes over
            }
        });

        window.addEventListener('gamepaddisconnected', (event) => {
            if (this.player1GamepadIndex === event.gamepad.index) {
                this.player1GamepadIndex = null;
            } else if (this.player2GamepadIndex === event.gamepad.index) {
                this.player2GamepadIndex = null;
            }
        });

        this.updateGamepads();
    
        // Keyboard event listeners remain intact
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
    // vibration for pressing event button
    async ultraPowerfulVibration(gamepad) {
        
        if (gamepad && gamepad.vibrationActuator) {                
            await gamepad.vibrationActuator.playEffect('dual-rumble', {
                duration: 50, strongMagnitude: 1.0, weakMagnitude: 1.0
            });
            await gamepad.vibrationActuator.playEffect('dual-rumble', {
                duration: 50, strongMagnitude: 1.0, weakMagnitude: 0.8
            });
            await gamepad.vibrationActuator.playEffect('dual-rumble', {
                duration: 50, strongMagnitude: 0.8, weakMagnitude: 0.5
            });
        }
    }
    updateGamepads() {
        const gamepads = navigator.getGamepads();

        if (this.player1GamepadIndex !== null && gamepads[this.player1GamepadIndex]) {
            const gamepad1 = gamepads[this.player1GamepadIndex];
            this.handleGamepadInput(gamepad1, 1);
        }
        if (this.player2GamepadIndex !== null && gamepads[this.player2GamepadIndex]) {
            const gamepad2 = gamepads[this.player2GamepadIndex];
            this.handleGamepadInput(gamepad2, 2);
        }

        requestAnimationFrame(() => this.updateGamepads());
    }

    handleGamepadInput(gamepad, player) {
        const buttons = gamepad.buttons;
        const axes = gamepad.axes;
    
        // Map shooting to RT (button 7) and events to X (button 2)
        const shootButton = buttons[7].pressed; // RT (R2 on PS controllers)
        const eventTrigger = buttons[2].pressed;  // X (Square on PS controllers)
    
        // Movement using the left stick vertical axis
        const moveUp = axes[1] < -0.5;
        const moveDown = axes[1] > 0.5;
    
        if (player === 1) {
            this.keys.shootPlayer1 = shootButton;
            this.keys.eventTrigger1 = eventTrigger;
    
            // Add or remove 'w' for move up
            if (moveUp && this.game.keys.indexOf('w') === -1) {
                this.game.keys.push('w');
            } else if (!moveUp && this.game.keys.indexOf('w') > -1) {
                this.game.keys.splice(this.game.keys.indexOf('w'), 1);
            }
    
            // Add or remove 's' for move down
            if (moveDown && this.game.keys.indexOf('s') === -1) {
                this.game.keys.push('s');
            } else if (!moveDown && this.game.keys.indexOf('s') > -1) {
                this.game.keys.splice(this.game.keys.indexOf('s'), 1);
            }
        } else if (player === 2) {
            this.keys.shootPlayer2 = shootButton;
            this.keys.eventTrigger2 = eventTrigger;
    
            // Add or remove 'ArrowUp' for move up
            if (moveUp && this.game.keys.indexOf('ArrowUp') === -1) {
                this.game.keys.push('ArrowUp');
            } else if (!moveUp && this.game.keys.indexOf('ArrowUp') > -1) {
                this.game.keys.splice(this.game.keys.indexOf('ArrowUp'), 1);
            }
    
            // Add or remove 'ArrowDown' for move down
            if (moveDown && this.game.keys.indexOf('ArrowDown') === -1) {
                this.game.keys.push('ArrowDown');
            } else if (!moveDown && this.game.keys.indexOf('ArrowDown') > -1) {
                this.game.keys.splice(this.game.keys.indexOf('ArrowDown'), 1);
            }
        }
    }
    

    update() {
        const currentTime = Date.now();
        const gamepads = navigator.getGamepads();
    
        // Player 1 shooting
        if (this.keys.shootPlayer1 && currentTime - this.lastShotTimePlayer1 >= this.shootCooldown) {
            this.game.player1.shootTop(3, this.game.player1.isEnd);  
            this.lastShotTimePlayer1 = currentTime;  
            
            // Trigger vibration for Player 1's controller if available
            if (this.player1GamepadIndex !== null) {
                const gp1 = gamepads[this.player1GamepadIndex];
                if (this.game.player1.allowControllerVibrate){
                    if (gp1 && gp1.vibrationActuator) {
                        powerfulVibration(gp1);
                    }
                }
   
            }
        }
    
        // Player 2 shooting
        if (this.keys.shootPlayer2 && currentTime - this.lastShotTimePlayer2 >= this.shootCooldown) {
            this.game.player2.shootTop(-3, this.game.player2.isEnd); 
            this.lastShotTimePlayer2 = currentTime;  
    
            // Trigger vibration for Player 2's controller if available
            if (this.player2GamepadIndex !== null) {
                const gp2 = gamepads[this.player2GamepadIndex];
                if (this.game.player2.allowControllerVibrate){
                    if (gp2 && gp2.vibrationActuator) {
                        powerfulVibration(gp2);
                    }
                }
                
            }
        }
        // vibration for when shooting
        async function powerfulVibration(gamepad) {
            if (gamepad.vibrationActuator) {
                await gamepad.vibrationActuator.playEffect('dual-rumble', {
                    duration: 20, strongMagnitude: 1.0, weakMagnitude: 1.0
                });
                await gamepad.vibrationActuator.playEffect('dual-rumble', {
                    duration: 20, strongMagnitude: 1.0, weakMagnitude: 0.5
                });
                await gamepad.vibrationActuator.playEffect('dual-rumble', {
                    duration: 20, strongMagnitude: 0.5, weakMagnitude: 0.2
                });
            }
        }
    
        if (this.game.eventActive && !this.game.eventWinner) {
            this.handleEventTrigger();
        }
    }
    

    enableEventListeners() {
        if (!this.eventTriggered) {
            window.addEventListener('keydown', this.handleEventTrigger);
            this.eventTriggered = true;
        }
    }

    handleEventTrigger = () => {
        if (this.game.eventActive && !this.game.eventWinner) {
            const gamepads = navigator.getGamepads();
            if (this.keys.eventTrigger1) { //if player 1 won the event
                if (this.player1GamepadIndex !== null) {
                    const gp1 = gamepads[this.player1GamepadIndex];
                    if (gp1 && gp1.vibrationActuator) {
                        this.ultraPowerfulVibration(gp1);  
                    }
                }
                let tempRand = Math.floor(Math.random() * 3); // randomises the event
                if (tempRand === 0) { // event tank
                    this.game.triggerAttack(this.game.player1, this.game.player2);
                } else if (tempRand === 1) { // event salute
                    this.game.triggerRestriction(this.game.player1, this.game.player2);
                } else { // event plane
                    this.game.triggerBouncing(this.game.player1, this.game.player2);
                }
            } else if (this.keys.eventTrigger2) { //if player 2 won the event
                if (this.player2GamepadIndex !== null) {
                    const gp2 = gamepads[this.player2GamepadIndex];
                    if (gp2 && gp2.vibrationActuator) {
                        this.ultraPowerfulVibration(gp2);
                    }
                    
                    
                }
                let tempRand = Math.floor(Math.random() * 3); // randomises the event
                if (tempRand === 0) { // event tank
                    this.game.triggerAttack(this.game.player2, this.game.player1);
                } else if (tempRand === 1) { // event salute
                    this.game.triggerRestriction(this.game.player2, this.game.player1);
                } else { // event plane
                    this.game.triggerBouncing(this.game.player2, this.game.player1);
                }
            }
            window.removeEventListener('keydown', this.handleEventTrigger);
            this.eventTriggered = false;
        }

    }

}
