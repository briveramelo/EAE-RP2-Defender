module Jelicopter.Client {
    
    export class ExplosionManager extends Phaser.Group {
        ship: Ship;
        originalXPosition;
        originalYPosition;
        emitter_blue_fire;
        emitter_smoke;
        person;
        constructor(game: Phaser.Game, level: MainGame) {
            super(game);
            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.emitter_blue_fire = game.add.emitter(game.world.centerX, 650, 900);
            this.emitter_blue_fire.makeParticles('blue_fire', [0, 1, 2], 900, true, true);
            this.emitter_blue_fire.gravity = 300;
            this.emitter_blue_fire.setAlpha(.8, 0, 1500);
            this.emitter_blue_fire.setScale(.8, .2, .8, .2, 4000, Phaser.Easing.Quintic.Out);

            // Explosion smoke
            this.emitter_smoke = game.add.emitter(game.world.centerX, 650, 900);
            this.emitter_smoke.makeParticles('ship_smoke', [0, 1, 2], 900, true, true);
            this.emitter_smoke.gravity = 10;
            this.emitter_smoke.setAlpha(.2, 0, 2000);
            this.emitter_smoke.setScale(1, .5, 1, .5, 5000, Phaser.Easing.Quintic.Out);
        }

        particleBurst(position) {
            //  Position the emitter where the mouse/touch event was
                this.emitter_blue_fire.x = position.x;
                this.emitter_blue_fire.y = position.y - 80;

            this.emitter_smoke.x = position.x;
            this.emitter_smoke.y = position.y-80;
            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst
            this.emitter_blue_fire.start(true, 1500, null, 8);
            this.emitter_smoke.start(true, 2000, null, 4);
        }
    }
}