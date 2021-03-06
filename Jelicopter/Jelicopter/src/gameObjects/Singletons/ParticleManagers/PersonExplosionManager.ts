﻿module Jelicopter.Client {

    export enum PersonType {
        Male1 = 0,
        Male2 = 1,
        Female1 = 2,
        Female2 = 3,
        Bob =4
    }

    export class PeopleExplosionManager {

        game: Phaser.Game;
        level: MainGame;
        emitterArray_bodyParts: Phaser.Particles.Arcade.Emitter[];
        emitter_blood: Phaser.Particles.Arcade.Emitter;
        emitter_guts: Phaser.Particles.Arcade.Emitter;


        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;

            // BodyParts
            this.emitterArray_bodyParts = [];

            for (var j: number = 0; j < 5; j++){
                var startScale = 0.6;
                var endScale = 0.5;
                var frameData = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                
                var bodyPartKey: string = PersonType[j] + "_Parts";
                this.emitterArray_bodyParts[j] = this.game.add.emitter(0, 0, 900);
                this.emitterArray_bodyParts[j].makeParticles(bodyPartKey, frameData, 900, true, true);
                this.emitterArray_bodyParts[j].gravity = 400;
                this.emitterArray_bodyParts[j].setAlpha(1, 0, 4000);
                this.emitterArray_bodyParts[j].setScale(endScale, startScale, endScale, startScale, 4000, Phaser.Easing.Quintic.Out);
                this.emitterArray_bodyParts[j].bounce.setTo(.1, .5);
                this.emitterArray_bodyParts[j].setXSpeed(-500, 500);
                this.emitterArray_bodyParts[j].setYSpeed(-500, 500);
                this.emitterArray_bodyParts[j].lifespan = 4000;
                //this.emitterArray_man1_parts[i].particleAnchor.y = -100;
            }

            // Blood
            this.emitter_blood = game.add.emitter(0, 0, 900);
            this.emitter_blood.makeParticles('blood', 1, 900, true, true);
            this.emitter_blood.gravity = 700;
            this.emitter_blood.setAlpha(1, 0, 4000);
            this.emitter_blood.setScale(.08, .1, .08, .1, 4000, Phaser.Easing.Quintic.Out);
            this.emitter_blood.setXSpeed(-30, 30);
            this.emitter_blood.setYSpeed(-400, 10);
            // Guts
            this.emitter_guts = game.add.emitter(0, 0, 900);
            this.emitter_guts.makeParticles('guts', [0, 1, 2], 60, true, true);
            this.emitter_guts.gravity = 800;
            this.emitter_guts.setAlpha(.8, 0, 4000);
            this.emitter_guts.setScale(.6, .5, .6, .5, 4000, Phaser.Easing.Quintic.Out);
            this.emitter_guts.setXSpeed(-300, 300);
            this.emitter_guts.setYSpeed(10, 10);            
        }

        explodeBody(position: Phaser.Point, bodyType: PersonType, shootDir?: Phaser.Point) {

            //  Position the emitter where the mouse/touch event was
            this.emitterArray_bodyParts[bodyType].x = position.x;
            this.emitterArray_bodyParts[bodyType].y = position.y;
            //this.emitterArray_bodyParts[bodyType].start(true, 6000, null, 9);
            
            var bodyPartKey: string = PersonType[bodyType] + "_Parts";
            
            for (var i: number = 0; i < 9; i++){
                this.emitterArray_bodyParts[bodyType].emitParticle(position.x, position.y, bodyPartKey, i);        
            }            

            this.emitter_blood.x = position.x;
            this.emitter_blood.y = position.y;

            this.emitter_guts.x = position.x;
            this.emitter_guts.y = position.y;
            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a 2000ms lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter (10) is how many particles will be emitted in this single burst

            this.emitter_guts.start(true, 4000, null, 3);
            this.emitter_blood.start(true, 4000, null, 150);
        }

    }

}