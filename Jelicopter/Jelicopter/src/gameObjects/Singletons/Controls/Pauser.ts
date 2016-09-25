module Jelicopter.Client {

    export class Pauser extends Phaser.Sprite {

        game: Phaser.Game;

        constructor(game: Phaser.Game) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            game.add.existing(this);
            this.game.input.keyboard.addCallbacks(this, this.unpause);
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)) {
                this.game.paused = true;
            }
        }

        unpause(event) {            
            if (this.game) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)){
                    this.game.paused = false;
                }
            }
        }
    }

}

