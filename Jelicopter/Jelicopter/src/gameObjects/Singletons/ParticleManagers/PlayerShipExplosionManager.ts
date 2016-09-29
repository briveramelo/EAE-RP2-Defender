module Jelicopter.Client {

    export class PlayerShipExplosionManager {

        game: Phaser.Game;
        level: MainGame;
        emitter_player_ship_parts: Phaser.Particles.Arcade.Emitter;
        emitter_smoke: Phaser.Particles.Arcade.Emitter;
        emitter_blue_fire: Phaser.Particles.Arcade.Emitter;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;

            this.emitter_player_ship_parts = game.add.emitter(0, 0, 30);
            this.emitter_player_ship_parts.makeParticles('ship_parts', [0, 1, 2, 3, 4, 5, 6, 7], 30, false, true);
            this.emitter_player_ship_parts.gravity = 400;
            this.emitter_player_ship_parts.setAlpha(1, 0, 3500);
            this.emitter_player_ship_parts.setScale(.6, .6, .6, .6, 3500, Phaser.Easing.Quintic.Out);
            this.emitter_player_ship_parts.bounce.setTo(.1, .5);
            this.emitter_player_ship_parts.setXSpeed(-500, 500);
            this.emitter_player_ship_parts.setYSpeed(-500, 500);


            // Smoke
            this.emitter_smoke = game.add.emitter(0, 0, 10);
            this.emitter_smoke.makeParticles('ship_smoke', [0, 1, 2], 10, false, false);
            this.emitter_smoke.gravity = 10;
            this.emitter_smoke.setAlpha(1, 0, 4000);
            this.emitter_smoke.setScale(1, .5, 1, .5, 4000, Phaser.Easing.Quintic.Out);
            
            // fire
            this.emitter_blue_fire = game.add.emitter(0, 0, 20);
            this.emitter_blue_fire.makeParticles('blue_fire', [0,1,2], 20, false, false);
            this.emitter_blue_fire.gravity = 700;
            this.emitter_blue_fire.setAlpha(.8, 0, 3500);
            this.emitter_blue_fire.setScale(1, .9, 1, .9, 3500, Phaser.Easing.Quintic.Out);
            this.emitter_blue_fire.setXSpeed(-300, 300);
            this.emitter_blue_fire.setYSpeed(-400, 100);
        }

        burstParticles(position: Phaser.Point) {
            this.emitter_player_ship_parts.x = position.x;
            this.emitter_player_ship_parts.y = position.y;

            this.emitter_smoke.x = position.x;
            this.emitter_smoke.y = position.y;

            this.emitter_blue_fire.x = position.x;
            this.emitter_blue_fire.y = position.y;
            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst

            this.emitter_blue_fire.start(true, 3500, null, 20);
            this.emitter_smoke.start(true, 3500, null, 10);
            this.emitter_player_ship_parts.start(true, 3500, null, 30);
        }

    }
}