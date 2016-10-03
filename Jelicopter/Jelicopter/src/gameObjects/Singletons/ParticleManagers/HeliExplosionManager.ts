module Jelicopter.Client {
    
    export class HeliExplosionManager extends Phaser.Group {

        emitter_shipParts: Phaser.Particles.Arcade.Emitter;
        emitter_smoke: Phaser.Particles.Arcade.Emitter;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game);
            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.emitter_shipParts = game.add.emitter(game.world.centerX, 650, 200);
            this.emitter_shipParts.makeParticles('heli_death_sprite', [0, 1, 2, 3, 4, 5, 6, 7, 8], 200, false, false);
            this.emitter_shipParts.gravity = 300;
            this.emitter_shipParts.setAlpha(.8, 0, 1500);
            this.emitter_shipParts.setScale(.8, .2, .8, .2, 4000, Phaser.Easing.Quintic.Out);
            this.emitter_shipParts.setXSpeed(-500, 500);
            this.emitter_shipParts.setYSpeed(-500, 500);
            this.emitter_shipParts.lifespan = 3000;

            // Explosion smoke
            this.emitter_smoke = game.add.emitter(game.world.centerX, 650, 100);
            this.emitter_smoke.makeParticles('ship_smoke', [0, 1, 2], 100, false, false);
            this.emitter_smoke.gravity = 10;
            this.emitter_smoke.setAlpha(.2, 0, 2000);
            this.emitter_smoke.setScale(1, .5, 1, .5, 5000, Phaser.Easing.Quintic.Out);
            this.emitter_smoke.lifespan = 2000;
        }

        particleBurst(position) {
            //  Position the emitter where the mouse/touch event was
            for (var i: number = 0; i < 17; i++) {
                this.emitter_shipParts.emitParticle(position.x, position.y, 'heli_death_sprite', i);
            }
            //this.emitter_smoke.x = ;
            //this.emitter_smoke.y = position.y;
            for (var i: number = 0; i < 4; i++) {
                this.emitter_smoke.emitParticle(position.x, position.y, 'ship_smoke');
            }
            //this.emitter_smoke.start(true, 2000, null, 4);           

        }
    }
}