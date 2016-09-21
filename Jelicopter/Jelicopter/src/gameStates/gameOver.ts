module Jelicopter.Client {

    export class GameOver extends Phaser.State {

        background: Phaser.Sprite;
        gameOverText;
        restartText;
        quitText;
        button;

        create() {
            this.background = this.add.sprite(0, 0, 'GameBackground');
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

            //  The Text is positioned at 0, 100
            this.gameOverText = this.game.add.text(400, 400, "GAME OVER", style);
            this.gameOverText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.gameOverText.fixedToCamera = true;
            this.restartText = this.game.add.text(400, 600, "Restart", { font: "bold 32px Arial", fill: "#ff0044", align: "center" });
            this.restartText.inputEnabled = true;
            this.restartText.events.onInputDown.add(this.actionOnClick, this);
            this.restartText.events.onInputOver.add(this.actionOnClick, this);
            this.restartText.events.onInputOut.add(this.actionOnClick, this);
            this.restartText.events.onInputUp.add(this.actionOnClick, this);

         
        }

       actionOnClick() {
           this.game.state.start('Level01', true, false);
    }

        update() {
            
        }
    }
}