import { Layer } from './Layer.js';

export class Background {
    constructor(game, isBeginAnim = false){
        this.game = game;
        this.isBeginAnim = isBeginAnim;
        this.image1 = document.getElementById('layer1');
        this.image2 = document.getElementById('layer2');
        this.image3 = document.getElementById('layer3');
        this.image4 = document.getElementById('layer4');
        this.image5 = document.getElementById('layer5');

        //layer player 1
        this.layer1 = new Layer(this.game, this.image1, 0.2, 0);
        this.layer2 = new Layer(this.game, this.image2, 0.4, 0);
        this.layer3 = new Layer(this.game, this.image3, 1, 0);
        this.layer4 = new Layer(this.game, this.image4, 1.5, 0);

        //layer player 2
        this.layer6 = new Layer(this.game, this.image1, -0.2, 0);
        this.layer7 = new Layer(this.game, this.image2, -0.4, 0);
        this.layer8 = new Layer(this.game, this.image3, -1, 0);
        this.layer9 = new Layer(this.game, this.image4, -1.5, 0);

        //layer crack
        this.layer5 = new Layer(this.game, this.image5, 0, 0);

        this.layers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer6, this.layer7, this.layer8, this.layer9, this.layer5];
    }
    update(){
        this.layers.forEach(layer => layer.update());
    }
    draw(context, isBeginAnim){
        if (!isBeginAnim){
            for (let index = 0; index < this.layers.length; index++) {
                const layer = this.layers[index];
                if (layer.speedModifier < 0){
                    layer.draw(context, 2); 
                }
            }
            this.layers.forEach(layer => {
                context.save(); // Save original state
        
                // Define clipping based on speed direction
                context.beginPath();
                if (layer.speedModifier > 0) {
                    // Moving left: Clip to the left half
                    context.rect(0, 0, this.game.width / 2, this.game.height);
                } else {
                    // Moving right: Clip to the right half
                    context.rect(this.game.width / 2, 0, this.game.width / 2, this.game.height);
                }
                context.clip();
        
                // Draw object
                if (layer.speedModifier > 0) {
                    layer.draw(context, 1);
                }
                context.restore(); // Reset clipping for next object
                this.layers[8].draw(context, 0);
    
            });  
        }
        else {
            for (let index = 0; index < 4; index++) {
                const layer = this.layers[index];
                layer.draw(context, 1); 
            } 
        }


        /*for (let index = 0; index < this.layers.length; index++) {
            const element = this.layers[index];
            if (index < 5){
                element.draw(context, 1);
            } else {
                element.draw(context, 2);
            }
            
        }*/
    }
}