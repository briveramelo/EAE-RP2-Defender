module Jelicopter.Client {

    export class Hospital extends Phaser.Sprite {

        myCollider: CircleCollider;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'Hospital');
            game.add.existing(this);
            //this.scale.set(0.2);
            this.game.physics.arcade.enable([this]);
            this.body.collideWorldBounds = true;
            this.myCollider = new CircleCollider(this, 30, new Phaser.Point(0, this.height));
        }
    }
}