module Jelicopter.Client {
    export enum SoundFX {
        Background = 0,
        PersonDeath = 1,
        FireShot = 2,
        Abduct = 3,
        HeliExplode = 4,
        FireRocket = 5,
        ShieldLost = 6,
        PlayerShipDeath = 7,
        GameOver = 8,
        FlingPerson = 9
    }
    export class SoundManager {
        soundLibrary: Phaser.Sound[];
        game: Phaser.Game;
        constructor(game: Phaser.Game) {
            this.game = game;
            this.soundLibrary = [];
            this.soundLibrary[SoundFX.Background] = this.game.add.audio('Aliens', .7, true);
            this.soundLibrary[SoundFX.PersonDeath] = this.game.add.audio('personDeath');
            this.soundLibrary[SoundFX.FireShot] = this.game.add.audio('fireShot');
            this.soundLibrary[SoundFX.Abduct] = this.game.add.audio('abduct');
            this.soundLibrary[SoundFX.HeliExplode] = this.game.add.audio('heliExplode');
            this.soundLibrary[SoundFX.FireRocket] = this.game.add.audio('fireRocket');
            this.soundLibrary[SoundFX.ShieldLost] = this.game.add.audio('shieldHit', 1.3);
            this.soundLibrary[SoundFX.PlayerShipDeath] = this.game.add.audio('personDeath');
            this.soundLibrary[SoundFX.GameOver] = this.game.add.audio('gameOver');
            this.soundLibrary[SoundFX.FlingPerson] = this.game.add.audio('flingPerson');
        }
        playSound(soundFX: SoundFX) {
            if (soundFX == SoundFX.Background) {
                if (!this.soundLibrary[soundFX].isPlaying) {
                    this.soundLibrary[soundFX].play();
                }
            }
            else {
                this.soundLibrary[soundFX].play();
            }
        }
        stopBackground() {
            this.soundLibrary[SoundFX.Background].stop();
        }
    }
}