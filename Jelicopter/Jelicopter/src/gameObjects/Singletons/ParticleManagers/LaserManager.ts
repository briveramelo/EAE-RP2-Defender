module Jelicopter.Client {

    export class LaserManager {

        game: Phaser.Game;
        level: MainGame;
        emitter_laser: Phaser.Particles.Arcade.Emitter;
        randomNumber: number;
        minMaxSpeed: Phaser.Point = new Phaser.Point(500, 2000);
        maxEmitters: number = 8;
        shotIndex:number;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
            //this.emitter_laser = [];
            this.emitter_laser = game.add.emitter(0, 0, 900);
            this.emitter_laser.makeParticles('laser', [0,1,2,3], 250, true, false);
            this.emitter_laser.gravity = 0;
            this.emitter_laser.setAlpha(1, 0, 1300);
            this.emitter_laser.setScale(2.5, 2.5, 2.5, 2.5, 1300, Phaser.Easing.Quintic.Out);
            this.emitter_laser.lifespan = 1300;

            this.emitter_laser.setYSpeed(-0, 2);
            this.emitter_laser.minRotation = 0;
            this.emitter_laser.maxRotation = 0;
        }

        fireLaserBurst(position: Phaser.Point, goingRight: boolean) {
            this.randomNumber = this.game.rnd.integerInRange(30, 34);
            var sideMultiplier: number = goingRight ? 1 : -1;
            var currentminMaxSpeed: Phaser.Point = new Phaser.Point(this.minMaxSpeed.x * sideMultiplier, this.minMaxSpeed.y * sideMultiplier);

            this.emitter_laser.x = position.x;
            this.emitter_laser.y = position.y;
            for (var i: number = 0; i < this.randomNumber; i++) {
                this.emitter_laser.setXSpeed(currentminMaxSpeed.x, currentminMaxSpeed.y);
                this.emitter_laser.maxParticleScale = 2.5;
                this.emitter_laser.minParticleScale = 2.5;
                this.emitter_laser.emitParticle(position.x, position.y, 'laser', i%4);
            }
        }
        
    }
}