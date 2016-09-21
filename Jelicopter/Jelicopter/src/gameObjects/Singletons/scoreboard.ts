module Jelicopter.Client {

    export class ScoreBoard{

        score: number = 0;
        scoreText;
        game: Phaser.Game;

        constructor(game: Phaser.Game) {
            this.game = game;
            this.displayScore();
        }

        displayScore() {
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

            //  The Text is positioned at 0, 100
            this.scoreText = this.game.add.text(0, 0, "Score: 0", style);
            this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.scoreText.fixedToCamera = true;
            //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
            // this.scoreText.setTextBounds(0, 100, 800, 100);
        }

        updateScore(pointsToAdd: number) {
            this.score += pointsToAdd;
            this.scoreText.text = 'Score: ' + this.score;
        }
    }
}