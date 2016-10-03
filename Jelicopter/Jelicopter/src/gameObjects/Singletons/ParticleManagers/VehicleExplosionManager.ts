module Jelicopter.Client {

    export class VehicleExplosionManager extends Phaser.Group {

        emitter_tankParts: Phaser.Particles.Arcade.Emitter;
        emitter_smoke: Phaser.Particles.Arcade.Emitter;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game);
            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.emitter_tankParts = game.add.emitter(game.world.centerX, 650, 900);
            this.emitter_tankParts.makeParticles('tank_burst', [0, 1, 2, 3, 4, 5], 200, false, false);
            this.emitter_tankParts.gravity = 300;
            this.emitter_tankParts.setAlpha(.8, 0, 1500);
            this.emitter_tankParts.setScale(1.3, .8, 1.3, .8, 4000, Phaser.Easing.Quintic.Out);
            this.emitter_tankParts.setXSpeed(-600, 600);
            this.emitter_tankParts.setYSpeed(-700, 700);
            this.emitter_tankParts.lifespan = 3000;

            // Explosion smoke
            this.emitter_smoke = game.add.emitter(game.world.centerX, 650, 900);
            this.emitter_smoke.makeParticles('ship_smoke', [0, 1, 2], 60, false, false);
            this.emitter_smoke.gravity = 10;
            this.emitter_smoke.setAlpha(.2, 0, 2000);
            this.emitter_smoke.setScale(1, .5, 1, .5, 5000, Phaser.Easing.Quintic.Out);
            this.emitter_smoke.lifespan = 2000;
        }

        particleBurst(position) {
            //  Position the emitter where the mouse/touch event was
            for (var j: number = 0; j < 3; j++) {                
                for (var i: number = 0; i < 6; i++) {
                    this.emitter_tankParts.emitParticle(position.x, position.y, 'tank_burst', i);
                }
            }

            for (var i: number = 0; i < 10; i++) {
                this.emitter_smoke.emitParticle(position.x, position.y, 'ship_smoke');
            }

        }
    }
}