import { Game } from './Classes/Game.js';

let selectedCharacters = []; // stores the current chosen characters in order (player1 first, player 2 second)
let gameStarted = false; // track if the "Start game" button has been pressed

let firstCharacter = null; // stores the current character player 1 has chosen
let secondCharacter = null; // stores the current character player 2 has chosen


// checks and stores the character that has been clicked on in the main screen by the current player
function selectCharacter(element, character) {
    if (firstCharacter === character) { //check if the current character has been chosen already by p1 and deletes him from selection
        firstCharacter = null;
        element.classList.remove('selected');
        element.removeAttribute('data-role');
    } 
    else if (secondCharacter === character) { //check if the current character has been chosen already by p2 and deletes him from selection
        secondCharacter = null;
        element.classList.remove('selected');
        element.removeAttribute('data-role'); 
    } 
    else if (firstCharacter === null) { //check if the current character hasn't been chosen already by p1 and adds him from selection
        firstCharacter = character;
        element.classList.add('selected');
        element.setAttribute('data-role', 'First Character');
    } 
    else if (secondCharacter === null) { //check if the current character hasn't been chosen already by p2 and adds him from selection
        secondCharacter = character;
        element.classList.add('selected');
        element.setAttribute('data-role', 'Second Character');
    }

    updateCharacterRoles();
}
// updates the roles of characters (green text saying "First Character" or "Second Character")
function updateCharacterRoles() {
    document.querySelectorAll('.character').forEach(char => {
        const roleText = char.getAttribute('data-role');
        let roleInfo = char.querySelector('.role-info');

        if (!roleInfo) {
            roleInfo = document.createElement('p');
            roleInfo.classList.add('role-info');
            char.appendChild(roleInfo);
        }

        roleInfo.textContent = roleText ? roleText : "‎ "; // Restore placeholder if no role
    });
}



// function for the beggining cracking of the screen animation
function startAnim() {
    if (firstCharacter == null || secondCharacter == null) {  // check if both characters have been selected before starting
        alert("Please select 2 characters first!"); // alert that not both characters have been selected
        return; // doesn't start the animation
    }
    selectedCharacters = [firstCharacter,secondCharacter]; // keeps track of who is the first and who is second character

    // hides the character selection page
    document.querySelector('.character-container').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';

    // creates a new canvas and context
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    // makes sure that the starting animation can't be triggered twice accidentally
    if (gameStarted) return; 
    gameStarted = true; 

    // creating a new game for the current animation
    const game = new Game(canvas.width, canvas.height);
    setTimeout(startGame, 3025); // startGame function will begin after 3.025 seconds (how long the cracking animation will take)

    //cracking animation logic:
    const slices = []; // holds all the images of slices
    const numSlices = 20; // how many slices are there
    const batchSize = 2; // how many slices per badge
    const waitTime = 500;  // how long to wait till starting next badge (0.5 seconds)

    let step = 0; // track current step in slices
    const middleIndex = Math.floor(numSlices / 2);
    
    // start cracking noise
    const crackSound = new Audio("./assets/sounds/crack.mp3"); 
    crackSound.volume = 0.7; // Adjust volume

    // starts the cracking animation
    for (let i = 1; i <= numSlices; i++) {
        const img = new Image();
        img.src = `./assets/slices/slice_${i}.png`;
        slices.push(img); // adds all the slices to the array "slices"
    }

    // function to draw the slices
    function drawSlices() {
        if (crackSound.ended) return;

        game.background.draw(ctx, true);

        for (let i = 0; i <= step; i++) {
            let upperIndex = middleIndex - i; // for upper slices
            let lowerIndex = middleIndex + i; // for lower slices

            if (upperIndex >= 0) { // draws upper slices
                ctx.drawImage(slices[upperIndex], 0, (canvas.height / numSlices) * upperIndex);
            }
            if (lowerIndex < numSlices) { // draws lower slices
                ctx.drawImage(slices[lowerIndex], 0, (canvas.height / numSlices) * lowerIndex);
            }
        }

        step += batchSize;
        setTimeout(drawSlices, waitTime);
    }
    // draws the slices
    slices[numSlices - 1].onload = function () {
        if (slices[0].width && slices[0].height) {
            canvas.width = 1500; //sets the width of the canvas as needed
            canvas.height = slices[0].height * numSlices; // sets the height of the canvas as needed
        }

        document.getElementById('canvas1').style.display = 'block'; 

        crackSound.play();
        drawSlices();
    };

    game.background.draw(ctx, true);
}

// function to start the first of 2 games
function startGame() {
    //canvas setup again for first game
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500; // same width as before
    canvas.height = 500; // same height as before
    const game = new Game(canvas.width, canvas.height); // new game as we start a new game
    
    // function to determain first and second player's attributes according to their selected character
    for (let i = 0; i < selectedCharacters.length; i++) { // check for both players
        const element = selectedCharacters[i];
        if (element == 'Eli') { // if the current chosen element is Eli set all his properties
            game['player' + (i + 1)].image = document.getElementById('eli');
            game['player' + (i + 1)].width = 77;
            game['player' + (i + 1)].height = 160;
            game['player' + (i + 1)].frameInterval = 150;
            game['player' + (i + 1)].id = 1;
            game['player' + (i + 1)].shootingSound = new Audio('./assets/sounds/swordSound.mp3');
            game['player' + (i + 1)].winningImage.src = './assets/winningImages/winningImageEli.png';

        }
        else if (element == 'Shai'){ // if the current chosen element is Shai set all his properties
            game['player' + (i + 1)].image = document.getElementById('shai');
            game['player' + (i + 1)].width = 100;
            game['player' + (i + 1)].height = 190;
            game['player' + (i + 1)].maxFrame = 5;
            game['player' + (i + 1)].frameInterval = 125;
            game['player' + (i + 1)].id = 2;
            game['player' + (i + 1)].shootingSound = new Audio('./assets/sounds/shatzSound.m4a');
            game['player' + (i + 1)].winningImage.src = './assets/winningImages/winningImageShai.png';
            game['player' + (i + 1)].winningSound = new Audio('./assets/sounds/winningSoundShai.mp3');

        }
        else if (element == 'Ron'){ // if the current chosen element is Ron set all his properties
            game['player' + (i + 1)].image = document.getElementById('ron');
            game['player' + (i + 1)].width = 94;
            game['player' + (i + 1)].height = 180;
            game['player' + (i + 1)].maxFrame = 4;
            game['player' + (i + 1)].frameInterval = 125;
            game['player' + (i + 1)].id = 3;
            game['player' + (i + 1)].shootingSound = new Audio('./assets/sounds/bootSound.mp3');
            game['player' + (i + 1)].winningImage.src = './assets/winningImages/winningImageRon.png';

        } else { // if the current chosen element is Card Master set all his properties
            game['player' + (i + 1)].image = document.getElementById('master');
            game['player' + (i + 1)].width = 114;
            game['player' + (i + 1)].height = 185;
            game['player' + (i + 1)].maxFrame = 9;
            game['player' + (i + 1)].frameInterval = 100;
            game['player' + (i + 1)].id = 4;
            game['player' + (i + 1)].shootingSound = new Audio('./assets/sounds/cardThrowSound.mp3');
            game['player' + (i + 1)].winningImage.src = './assets/winningImages/winningImageCard.png';
        }
    }

    // keeps track of the current time (after the cracking and character selection)
    game.gameTime = 0; 
    let lastTime = performance.now(); 

    //animation loops
    function animate(timeStamp){ 
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if (game.gameTime <= game.timeLimit) requestAnimationFrame(animate); // if 120 seconds haven't passed
        else startReverseAnim(game, ctx, canvas, lastTime); // else start the ending animation (crack reversing)
    }
    animate(lastTime);
}

// crack reversing animation
function startReverseAnim(game, ctx, canvas, lastTime) {
    setTimeout(endGame, 3325, game, ctx, canvas, lastTime); // once cracking animation finishes start the end Game

    canvas.width = 1500; // same width as before
    canvas.height = 500; // same height as before

    
    const slices = []; // holds all the images of slices
    const numSlices = 20; // Total slices
    const quickTime = 625; // 0.625 seconds
    const waitTime = 500; // 0.5 seconds

    // inserts into the "slices" array all the images of the slices
    for (let i = 1; i <= numSlices; i++) {
        const img = new Image();
        img.src = `./assets/slices/slice_${i}.png`; 
        slices.push(img);
    }

    let topIndex = 0; 
    let bottomIndex = numSlices - 1; 

    // sound effect of reverse crack
    const crackSoundReverse = new Audio("./assets/sounds/crackReverse.mp3"); 
    crackSoundReverse.volume = 0.7; // Adjust volume

    // function to delete all of the slices
    function drawSlices() { 
        if (crackSoundReverse.ended) return;
        game.background.draw(ctx, true);

        for (let i = 0; i < numSlices; i++) {
            if (i >= topIndex && i <= bottomIndex) {
                ctx.drawImage(slices[i], 0, (canvas.height / numSlices) * i);
            }
        }

        topIndex += 2;
        bottomIndex -= 2;

        if (topIndex === 8 && bottomIndex === 11) {
            topIndex += 1;
            bottomIndex -= 1; 
        }

        if (topIndex >= bottomIndex) {
            setTimeout(() => {
                game.background.draw(ctx, true); 

            }, quickTime);
            return;
        }

        let nextDelay = (topIndex < bottomIndex) ? waitTime : quickTime;
        setTimeout(drawSlices, nextDelay);
    }

    // Start animation when images are loaded
    slices[numSlices - 1].onload = function () {
        canvas.width = 1500;
        canvas.height = slices[0].height * numSlices;

        crackSoundReverse.play();
        drawSlices();
    };
}

// function for the end Game
function endGame(game, ctx, canvas, lastTime){
    game.player1.lives += Math.floor((game.player1.score / 10)); // divide the score of p1 by 10 and add to current lives to calc lives
    game.player2.lives += Math.floor((game.player2.score / 10)); // divide the score of p2 by 10 and add to current lives to calc lives
    if (game.player1.lives < 25) game.player1.lives = 25; // if p1 lives are under 25 make them 25 (min lives are 25)
    if (game.player2.lives < 25) game.player2.lives = 25; // if p2 lives are under 25 make them 25 (min lives are 25)
    game.player1.isEnd = true; // set isEnd to true to determine if player 1 has entered the End Game
    game.player2.isEnd = true; // set isEnd to true to determine if player 1 has entered the End Game
    game.background.isBeginAnim = true; 
    game.player1.projectiles = []; // delete all projectiles on screen
    game.player2.projectiles = []; // delete all projectiles on screen
    game.particles = []; // delete all particles on screen

    function animate(timeStamp){ // start animation
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(lastTime);
}
// shows instructions once button is pressed
function showInstructions() { 
    const modal = document.getElementById('instruction-modal');
    modal.style.visibility = 'visible'; // Ensure the modal is interactable
    modal.style.opacity = '1'; // Ensure full opacity
    modal.classList.add('show'); // Trigger slide-up animation
    document.getElementById("instruction-modal").addEventListener("click", function (event) {
        if (event.target === this) {
            closeInstructions();
        }
    });
}

// closes instructions
function closeInstructions() {
    const modal = document.getElementById('instruction-modal');

    // Trigger slide-down animation
    modal.classList.remove('show');

    // Wait for the transition to finish, then hide the modal
    modal.addEventListener('transitionend', function handleTransitionEnd() {
        modal.style.visibility = 'hidden'; // Prevent interaction
        modal.style.opacity = '0'; // Reset opacity for next time
        modal.removeEventListener('transitionend', handleTransitionEnd); // Clean up event listener
    });
}

// window action to keep functions in track
window.selectCharacter = selectCharacter;
window.startAnim = startAnim;
window.startGame = startGame;
window.showInstructions = showInstructions;
window.closeInstructions = closeInstructions;