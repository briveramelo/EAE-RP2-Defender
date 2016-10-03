module Jelicopter.Client {

    export enum Points {
        Human = 0,
        Paratrooper = 1,
        Heli = 2,
        Vehicle = 3,

        HumanToHuman = 4,
        HumanToVehicle = 5,
        HumanToParatrooper = 6,
        HumanToHeli = 7,

        ParatrooperToParatrooper = 8,
        ParatrooperToVehicle = 9,
        ParatrooperToHeli = 10,

        VehicleToVehicle = 11,
        VehicleToHeli = 12
    }

    export class ScoreBoard {

        score: number = 0;
        scoreText;
        game: Phaser.Game;
        scoreLibrary: number[];
        score_animationEmitter: Phaser.Particles.Arcade.Emitter;

        constructor(game: Phaser.Game) {
            this.game = game;

            this.scoreLibrary = [];
            this.scoreLibrary[0] = 100;
            this.scoreLibrary[1] = 200;
            this.scoreLibrary[2] = 200;
            this.scoreLibrary[3] = 200;

            this.scoreLibrary[4] = 700;
            this.scoreLibrary[5] = 800;
            this.scoreLibrary[6] = 500;
            this.scoreLibrary[7] = 500;

            this.scoreLibrary[8] = 2000;
            this.scoreLibrary[9] = 1000;
            this.scoreLibrary[10] = 2000;

            this.scoreLibrary[11] = 1500;
            this.scoreLibrary[12] = 1000;

            this.createScoreParticleEmitter();
            this.displayScore();
        }

        createScoreParticleEmitter() {
            this.score_animationEmitter = this.game.add.emitter(1, 1, 100);
            
            var startScale = 1;
            var endScale = 2.75;
            this.score_animationEmitter.gravity = -150;
            this.score_animationEmitter.setAlpha(1, 0, 4000);
            this.score_animationEmitter.setScale(startScale, endScale, startScale, endScale, 5000, Phaser.Easing.Quintic.Out);
            this.score_animationEmitter.minRotation = 0;
            this.score_animationEmitter.maxRotation = 0.1;
            this.score_animationEmitter.makeParticles('score_feedback', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 100, false, false);
            this.score_animationEmitter.lifespan = 5000;
        }

        displayScore() {
            var style = { font: "30px PixelFont", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

            this.scoreText = this.game.add.text(20, 20, "Score: 0", style);
            this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.scoreText.fixedToCamera = true;
        }

        giveFeedbackOfScore(position, pointsToAdd: Points) {
            this.score += this.scoreLibrary[pointsToAdd];
            this.score_animationEmitter.emitParticle(position.x, position.y, 'score_feedback', this.pointsToFrame(this.scoreLibrary[pointsToAdd]) );            
            this.scoreText.text = 'Score: ' + this.score;
        }

        pointsToFrame(points) {
            var frameCount = points / 100 -1;
            return frameCount;
        }
    }
}