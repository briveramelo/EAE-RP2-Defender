module Jelicopter.Client {

    export class People extends Phaser.Group {
        ship: Ship;
        originalXPosition;
        originalYPosition;
        constructor(game: Phaser.Game, ship: Ship) {
            super(game);
            var person = this.game.add.sprite(200, 550, 'JumpingMale', 1);
            this.originalXPosition = 200;
            this.originalYPosition = 550;
            this.add(person);
            this.callAll('animations.add', 'animations', 'wave', [0, 1, 2, 3, 4], 15, true);
            this.callAll('play', null, 'wave');
            this.game.physics.arcade.enable(this);
            this.scale.set(0.62);
            this.callAll('body.collideWorldBounds', '', true);
            this.ship = ship;
        }



    }
}