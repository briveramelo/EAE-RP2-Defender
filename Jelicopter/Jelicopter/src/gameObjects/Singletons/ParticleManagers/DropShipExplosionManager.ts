module Jelicopter.Client {
    
    export class DropShipExplosionManager extends Phaser.Group {

        emitter_shipParts: Phaser.Particles.Arcade.Emitter;
        emitter_smoke;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game);
            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.emitter_shipParts = game.add.emitter(game.world.centerX, 650, 900);
            this.emitter_shipParts.makeParticles('ship_death_sprite', [0, 1, 2, 3, 4, 5, 6, 7, 8], 200, true, true);
            this.emitter_shipParts.gravity = 300;
            this.emitter_shipParts.setAlpha(.8, 0, 1500);
            this.emitter_shipParts.setScale(.8, .2, .8, .2, 4000, Phaser.Easing.Quintic.Out);
            this.emitter_shipParts.setXSpeed(-500, 500);
            this.emitter_shipParts.setYSpeed(-500, 500);

            // Explosion smoke
            this.emitter_smoke = game.add.emitter(game.world.centerX, 650, 900);
            this.emitter_smoke.makeParticles('ship_smoke', [0, 1, 2], 900, true, true);
            this.emitter_smoke.gravity = 10;
            this.emitter_smoke.setAlpha(.2, 0, 2000);
            this.emitter_smoke.setScale(1, .5, 1, .5, 5000, Phaser.Easing.Quintic.Out);
        }

        particleBurst(position, source) {
            //  Position the emitter where the mouse/touch event was
            for (var i: number = 0; i < 17; i++) {
                this.emitter_shipParts.emitParticle(position.x, position.y, 'ship_death_sprite', i);
            }
            this.emitter_smoke.x = position.x;
            this.emitter_smoke.y = position.y;
            this.emitter_smoke.start(true, 2000, null, 4);           

        }
    }
}