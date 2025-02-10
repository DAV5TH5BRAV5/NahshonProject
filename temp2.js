import { Game } from './Classes/Game.js';

let selectedCharacters = [];
let gameStarted = false;

function selectCharacter(element, character) {
    
    // If selected then remove
    if (selectedCharacters.includes(character)) {
        selectedCharacters = selectedCharacters.filter(c => c !== character);
        element.classList.remove('selected');
    } 
    // Max 2 selections
    else if (selectedCharacters.length < 2) {
        selectedCharacters.push(character);
        element.classList.add('selected');
    }

}

function startAnim(){
    if (selectedCharacters.length !== 2) {  
        alert("Please select a character first!");
        return;
    }

    // Hide character selection and show game canvas
    document.querySelector('.character-container').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    document.getElementById('canvas1').style.display = 'block';
    if (gameStarted) return; 
    gameStarted = true; 
        //canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
}

function startGame() {
    if (selectedCharacters.length !== 2) {  
        alert("Please select a character first!");
        return;
    }

    // Hide character selection and show game canvas
    document.querySelector('.character-container').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    document.getElementById('canvas1').style.display = 'block';
    if (gameStarted) return; 
    gameStarted = true; 
        //canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    
    const game = new Game(canvas.width, canvas.height);
    game.gameTime = 0;  // Reset game time when the game starts
    let lastTime = performance.now();  // Get the actual time when the game starts
    //animation loops
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(lastTime);

}

function showInstructions() {
    alert("Use arrow keys to move your character and spacebar to jump. Avoid obstacles and reach the finish line!");
}
window.selectCharacter = selectCharacter;
window.startGame = startGame;
window.showInstructions = showInstructions;