module Jelicopter.Client {    

    export enum SoundFX{
        PersonDeath = 0,
        FireShot = 1,
        Abduct = 2,
        DropShipExplode = 3,
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
            this.soundLibrary[SoundFX.DropShipExplode] = this.game.add.audio('dropShipExplode');
        }        

        playSound(soundFX: SoundFX) {
            this.soundLibrary[soundFX].play();
        }
    }
}