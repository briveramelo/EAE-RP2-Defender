module Jelicopter.Client {

    export class Hospital extends Phaser.Sprite {

        myCollider: CircleCollider;

        allPatientSaved:boolean = false;
        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'Hospital',0);
            game.add.existing(this);
            this.animations.add('shake1', [42, 43, 44, 45], 10, false);
            this.animations.add('shake2', [38, 39, 40, 41], 10, false);
            this.animations.add('shake3', [34, 35, 36, 37], 10, false);
            this.animations.add('shake4', [30, 31, 32, 33], 10, false);
            this.animations.add('shake5', [26, 27, 28, 29], 10, false);
            this.animations.add('shake6', [22, 23, 24, 25], 10, false);
            this.animations.add('shake7', [18, 19, 20, 21], 10, false);
            this.animations.add('shake8', [14, 15, 16, 17], 10, false);
            this.animations.add('shake9', [10, 11, 12, 13], 10, false);
            this.game.physics.arcade.enable([this]);
            this.body.collideWorldBounds = true;
            this.myCollider = new CircleCollider(this, 30, new Phaser.Point(0, this.height));
        }
    }
}