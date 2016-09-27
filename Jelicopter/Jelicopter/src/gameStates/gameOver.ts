module Jelicopter.Client {

    export class GameOver extends Phaser.State {

        background: Phaser.Sprite;
        scoreText;
        gameOverText;
        restartText;
        quitText;
        button;
        joystick: Phaser.SinglePad;
        mainGame: MainGame;

        constructor(mainGame: MainGame) {
            super();
            this.mainGame = mainGame;
        }

        create() {
            this.background = this.add.sprite(0, 0, 'GameBackground');
            var gameOverStyle = { font: "bold 32px Arial", fill: "#ff0044", boundsAlignH: "center", boundsAlignV: "middle" };
            var restartStyle = { font: "bold 64px Arial", fill: "#fff", align: "center" };
            var scoreStyle = { font: "bold 128px Arial", fill: "#fff", align: "center"};

            //  The Text is positioned at 0, 100

            var score: string = this.mainGame.scoreboard.score.toString();
            this.scoreText = this.game.add.text(685, 150, score, scoreStyle);
            this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.scoreText.fixedToCamera = true;

            //this.gameOverText = this.game.add.text(700, 400, "GAME OVER", gameOverStyle);
            //this.gameOverText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            //this.gameOverText.fixedToCamera = true;


            this.restartText = this.game.add.text(685, 320, "Restart", restartStyle);
            //this.restartText.inputEnabled = true;
            //this.restartText.events.onInputDown.add(this.actionOnClick, this);
            //this.restartText.events.onInputOver.add(this.actionOnClick, this);
            //this.restartText.events.onInputOut.add(this.actionOnClick, this);
            //this.restartText.events.onInputUp.add(this.actionOnClick, this);

            this.game.input.gamepad.start();
            // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
            this.joystick = this.game.input.gamepad.pad1;
        }

        actionOnClick() {
            this.mainGame.soundManager.backgroundMusic.stop();
            this.game.state.start('MainGame', true, false);
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) ||
                this.joystick.isDown(Phaser.Gamepad.BUTTON_0) || 
                this.game.input.activePointer.leftButton.isDown) {
                this.actionOnClick();
            }
        }
    }
}