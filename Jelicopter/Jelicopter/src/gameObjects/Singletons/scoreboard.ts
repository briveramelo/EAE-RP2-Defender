﻿module Jelicopter.Client {

    export class ScoreBoard{

        score: number = 0;
        scoreText;
        game: Phaser.Game;
        score_animation;

        constructor(game: Phaser.Game) {
            this.game = game;
            this.score_animation = game.add.emitter(1, 1, 100);
            this.score_animation.makeParticles('score_feedback', [3], 900, true, true);
            this.score_animation.gravity = -50;
            this.score_animation.setAlpha(1, 0, 5000);
            this.score_animation.setScale(.2, 1.2, .2, 1.2, 5000, Phaser.Easing.Quintic.Out);
            this.score_animation.minRotation = 0;
            this.score_animation.maxRotation = 0.1;
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

        giveFeedbackOfScore(position) {
            this.score_animation.x = position.x;
            this.score_animation.y = position.y;

            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst
            this.score_animation.start(true, 5000, 2000, 1);
        }
    }
}