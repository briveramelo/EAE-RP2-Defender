module Jelicopter.Client {

    export class TractorBeamParticleManager {

        game: Phaser.Game;
        level: MainGame;
        emitter_indicator: Phaser.Particles.Arcade.Emitter;
        
        indicator_startAngle = 100;
        baseYSpeed = 200;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;

            
            this.emitter_indicator = game.add.emitter(1, 1, 30);
            this.emitter_indicator.makeParticles('tractorBeamPulse', [0], 30, false, false);
            this.emitter_indicator.gravity = 0;
            this.emitter_indicator.setAlpha(1, 0, 1500);
            this.emitter_indicator.setScale(.01, 2, .01, 2, 3000, Phaser.Easing.Quintic.Out);
            this.emitter_indicator.minRotation = 0;
            this.emitter_indicator.maxRotation = 0;
            
            this.emitter_indicator.lifespan = 2500;     
        }

        pulseEmitter(position: Phaser.Point, velocity: Phaser.Point) {
            this.emitter_indicator.setXSpeed(velocity.x, velocity.x);
            this.emitter_indicator.setYSpeed(this.baseYSpeed, this.baseYSpeed);
            this.emitter_indicator.emitParticle(position.x, position.y, 'tractorBeamPulse');
        }

    }
}

