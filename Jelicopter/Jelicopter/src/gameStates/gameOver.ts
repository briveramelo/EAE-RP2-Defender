module Jelicopter.Client {
    export class GameOver extends Phaser.State {
        background: Phaser.Sprite;
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
            this.loadCreditsText();

            this.game.input.gamepad.start();
            this.joystick = this.game.input.gamepad.pad1;
        }
        loadScoreText() {
            var scoreStyle = { font: "125px PixelFont", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            var score: string = this.mainGame.scoreboard.score.toString();
            var scoreText = this.game.add.text(0, 275, score, scoreStyle);
            scoreText.x = this.camera.position.x + this.camera.width / 2;// - this.scoreText.width/2;
            scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            scoreText.fixedToCamera = true;
            scoreText.anchor.set(0.5);
            if (this.mainGame.scoreboard.score >= 30000) {
                var upTween = this.game.add.tween(scoreText.scale).to({ x: 1.5, y: 1.5 }, 300, Phaser.Easing.Linear.None, true, 0, -1, true);
                scoreText.fill = "#0F0";
            }
        }
        restartText;
        creditsText;
        loadRestartText() {
            var restartPlainStyle = { font: "100px PixelFont", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            this.restartText = this.game.add.text(0, 445, "Restart", restartPlainStyle);
            this.restartText.x = this.camera.position.x + this.camera.width / 2 - this.restartText.width / 2;

            this.restartText.inputEnabled = true;
            this.restartText.events.onInputDown.add(this.loadNewGame, this);
        }
        
        loadCreditsText() {
            var creditsPlainStyle = { font: "40px PixelFont", fill: "#fff", align: "center" };
            this.creditsText = this.game.add.text(1630, 750, "Credits", creditsPlainStyle);
            this.creditsText.anchor.set(0.5);

            this.creditsText.inputEnabled = true;
            this.creditsText.events.onInputDown.add(this.loadCredits, this);
        }
        loadNewGame() {
            this.mainGame.soundManager.stopBackground();
            this.game.state.start('MainGame', true, false);
        }
        loadCredits() {
            this.game.state.start('Credits', true, false);
        }
        update() {
            if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) ||
                this.joystick.isDown(Phaser.Gamepad.BUTTON_0)) {

                this.loadNewGame();
            }
            //else if (this.game.input.activePointer.leftButton.isDown) {
            //    this.loadCredits();
            //}
        }
    }
}