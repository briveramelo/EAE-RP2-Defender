module Jelicopter.Client {
    
    export class ExplosionManager extends Phaser.Group {
        ship: Ship;
        originalXPosition;
        originalYPosition;
        emitter_blue_fire;
        emitter_slime;
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

            this.emitter_slime = game.add.emitter(10, 10, 100);
            this.emitter_slime.makeParticles('slime_death', [0, 1, 2,], 100, false, true);
            this.emitter_slime.gravity = 400;
            this.emitter_slime.setAlpha(1, 0, 5000);
            this.emitter_slime.setScale(1, .6, 1, .6, 5000, Phaser.Easing.Quintic.Out);
            this.emitter_slime.bounce.setTo(0.5, 0.1);
            this.emitter_slime.angularDrag = 30;

            // Explosion smoke
            this.emitter_smoke = game.add.emitter(game.world.centerX, 650, 900);
            this.emitter_smoke.makeParticles('ship_smoke', [0, 1, 2], 900, true, true);
            this.emitter_smoke.gravity = 10;
            this.emitter_smoke.setAlpha(.2, 0, 2000);
            this.emitter_smoke.setScale(1, .5, 1, .5, 5000, Phaser.Easing.Quintic.Out);
        }

        particleBurst(position,source) {
            //  Position the emitter where the mouse/touch event was
            if (source === "blueShip") {
                this.emitter_blue_fire.x = position.x;
                this.emitter_blue_fire.y = position.y - 80;
                this.emitter_blue_fire.start(true, 1500, null, 8);
                this.emitter_smoke.x = position.x;
                this.emitter_smoke.y = position.y - 80;
                this.emitter_smoke.start(true, 2000, null, 4);
            }
            else if (source === "slimeShip") {
                this.emitter_slime.x = position.x;
                this.emitter_slime.y = position.y - 80;
                this.emitter_slime.start(true, 5000, null, 6);
            }
        
        //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        
        
    }
    }
}