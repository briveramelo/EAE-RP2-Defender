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
            this.background = this.add.sprite(0, 0, 'GameOver');

            this.loadScoreText();
            this.loadRestartText();

            this.game.input.gamepad.start();
            this.joystick = this.game.input.gamepad.pad1;
        }
        loadScoreText() {
            var scoreStyle = { font: "bold 128px Arial", fill: "#fff", align: "center" };
            var score: string = this.mainGame.scoreboard.score.toString();
            this.scoreText = this.game.add.text(835, 275, score, scoreStyle);
            this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.scoreText.fixedToCamera = true;
        }
        loadRestartText() {
            var restartStyle = { font: "bold 64px Arial", fill: "#fff", align: "center" };
            this.restartText = this.game.add.text(835, 445, "Restart", restartStyle);
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