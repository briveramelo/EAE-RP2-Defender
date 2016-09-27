﻿module Jelicopter.Client {    

    export enum SoundFX{
        PersonDeath = 0,
        FireShot = 1,
        Abduct = 2,
        HeliExplode = 3,
    }

    export class SoundManager {

        soundLibrary: Phaser.Sound[];
        backgroundMusic: Phaser.Sound;
        game: Phaser.Game;

        constructor(game: Phaser.Game) {
            this.game = game;            
            this.backgroundMusic = this.game.add.audio('Aliens', 1, true).play();

            this.soundLibrary = [];
            this.soundLibrary[SoundFX.PersonDeath] = this.game.add.audio('personDeath');
            this.soundLibrary[SoundFX.FireShot] = this.game.add.audio('fireShot');
            this.soundLibrary[SoundFX.Abduct] = this.game.add.audio('abduct');
            this.soundLibrary[SoundFX.HeliExplode] = this.game.add.audio('heliExplode');
        }        

        playSound(soundFX: SoundFX) {
            this.soundLibrary[soundFX].play();
        }
    }
}