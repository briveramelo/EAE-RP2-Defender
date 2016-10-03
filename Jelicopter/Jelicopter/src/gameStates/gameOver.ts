module Jelicopter.Client {
    export class GameOver extends Phaser.State {
        background: Phaser.Sprite;
        scoreText: Phaser.Text;
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
            this.background = this.add.sprite(0, 0, 'GameOver');

            this.loadScoreText();
            this.loadRestartText();

            this.game.input.gamepad.start();
            this.joystick = this.game.input.gamepad.pad1;
        }
        loadScoreText() {
            var scoreStyle = { font: "125px PixelFont", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            var score: string = this.mainGame.scoreboard.score.toString();
            this.scoreText = this.game.add.text(0, 275, score, scoreStyle);
            this.scoreText.x = this.camera.position.x + this.camera.width / 2 - this.scoreText.width/2;
            this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.scoreText.fixedToCamera = true;
        }
        loadRestartText() {
            var restartStyle = { font: "100px PixelFont", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            this.restartText = this.game.add.text(0, 445, "Restart", restartStyle);
            this.restartText.x = this.camera.position.x + this.camera.width / 2 - this.restartText.width / 2;
        }
        actionOnClick() {
            this.mainGame.soundManager.stopBackground();
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