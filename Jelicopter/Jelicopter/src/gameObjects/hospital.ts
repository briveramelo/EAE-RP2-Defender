module Jelicopter.Client {

    export class Hospital extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'Hospital',0);
            game.add.existing(this);
           // this.position.Y = 750;
            this.scale.set(0.5);
            this.game.physics.arcade.enable([this]);
            this.body.collideWorldBounds = true;
        }
    }
}