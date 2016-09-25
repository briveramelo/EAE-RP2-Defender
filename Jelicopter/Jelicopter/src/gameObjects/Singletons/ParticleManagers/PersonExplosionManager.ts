module Jelicopter.Client {

    export class PeopleExplosionManager {

        game: Phaser.Game;
        level: MainGame;
        emitterArray_man1_parts;
        emitter_blood: Phaser.Particles.Arcade.Emitter;
        emitter_guts: Phaser.Particles.Arcade.Emitter;


        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;

            // Man 1 Parts
            this.emitterArray_man1_parts = [];
            for (var i: number = 0; i < 9; i++) {
                this.emitterArray_man1_parts[i] = this.game.add.emitter(0, 0, 900);
                this.emitterArray_man1_parts[i].makeParticles('man1_parts', [i], 900, true, true);
                this.emitterArray_man1_parts[i].gravity = 400;
                this.emitterArray_man1_parts[i].setAlpha(1, 0, 6000);
                this.emitterArray_man1_parts[i].setScale(.6, .6, 6000, Phaser.Easing.Quintic.Out);
                this.emitterArray_man1_parts[i].bounce.setTo(.1, .5);
                this.emitterArray_man1_parts[i].setXSpeed(-500, 500);
                this.emitterArray_man1_parts[i].setYSpeed(-500, 500);
                //this.emitterArray_man1_parts[i].particleAnchor.y = -100;
            }   

            // Blood
            this.emitter_blood = game.add.emitter(0, 0, 900);
            this.emitter_blood.makeParticles('blood', 1, 900, true, true);
            this.emitter_blood.gravity = 700;
            this.emitter_blood.setAlpha(1, .0, 3500);
            this.emitter_blood.setScale(.08, .1, .08, .1, 3500, Phaser.Easing.Quintic.Out);
            this.emitter_blood.setXSpeed(-30, 30);
            this.emitter_blood.setYSpeed(-400, 10);
            // Guts
            this.emitter_guts = game.add.emitter(0, 0, 900);
            this.emitter_guts.makeParticles('guts', [0, 1, 2], 900, true, true);
            this.emitter_guts.gravity = 800;
            this.emitter_guts.setAlpha(.8, 0, 3500);
            this.emitter_guts.setScale(1, .9, 1, .9, 3500, Phaser.Easing.Quintic.Out);
            this.emitter_guts.setXSpeed(-300, 300);
            this.emitter_guts.setYSpeed(10, 10);            
        }

        explodeBody(position: Phaser.Point, shootDir?: Phaser.Point) {
            //  Position the emitter where the mouse/touch event was
            for (var i:number = 0; i < 9; i++) {
                this.emitterArray_man1_parts[i].x = position.x;
                this.emitterArray_man1_parts[i].y = position.y;
                this.emitterArray_man1_parts[i].start(true, 6000, null, 1);
            }

            this.emitter_blood.x = position.x;
            this.emitter_blood.y = position.y;

            this.emitter_guts.x = position.x;
            this.emitter_guts.y = position.y;
            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst

            this.emitter_guts.start(true, 3500, null, 3);
            this.emitter_blood.start(true, 3500, null, 150);
        }

    }

}