module Jelicopter.Client {
    export enum SoundFX {
        Background = 0,
        PersonDeath = 1,
        FireShot = 2,
        Abduct = 3,
        HeliExplode = 4,
        FireRocket = 5,
        ShieldLost = 6,
        PlayerShipDeath = 7
    }
    export class SoundManager {
        soundLibrary: Phaser.Sound[];
        game: Phaser.Game;
        constructor(game: Phaser.Game) {
            this.game = game;
            this.soundLibrary = [];
            this.soundLibrary[SoundFX.Background] = this.game.add.audio('Aliens', 1, true);
            this.soundLibrary[SoundFX.PersonDeath] = this.game.add.audio('personDeath1');
            this.soundLibrary[SoundFX.FireShot] = this.game.add.audio('fireShot2');
            this.soundLibrary[SoundFX.Abduct] = this.game.add.audio('abduct1');
            this.soundLibrary[SoundFX.HeliExplode] = this.game.add.audio('heliExplode2');
            this.soundLibrary[SoundFX.FireRocket] = this.game.add.audio('fireRocket1');
            this.soundLibrary[SoundFX.ShieldLost] = this.game.add.audio('tankExplode');
            this.soundLibrary[SoundFX.PlayerShipDeath] = this.game.add.audio('personDeath3');
        }
        playSound(soundFX: SoundFX) {
            this.soundLibrary[soundFX].play();
        }
        stopBackground() {
            this.soundLibrary[SoundFX.Background].stop();
        }
    }
}