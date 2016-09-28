module Jelicopter.Client {    

    export enum SoundFX{
        Background=0,
        PersonDeath = 1,
        FireShot = 2,
        Abduct = 3,
        HeliExplode = 4,
    }

    export class SoundManager {

        soundLibrary: Phaser.Sound[];
        game: Phaser.Game;

        constructor(game: Phaser.Game) {
            this.game = game;            

            this.soundLibrary = [];
            this.soundLibrary[SoundFX.Background] = this.game.add.audio('Aliens', 1, true);
            this.soundLibrary[SoundFX.PersonDeath] = this.game.add.audio('personDeath');
            this.soundLibrary[SoundFX.FireShot] = this.game.add.audio('fireShot');
            this.soundLibrary[SoundFX.Abduct] = this.game.add.audio('abduct');
            this.soundLibrary[SoundFX.HeliExplode] = this.game.add.audio('heliExplode');
        }        

        playSound(soundFX: SoundFX) {
            this.soundLibrary[soundFX].play();
        }
        stopBackground() {
            this.soundLibrary[SoundFX.Background].stop();
        }
    }
}