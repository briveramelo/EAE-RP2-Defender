module Jelicopter.Client {

    export class People extends Phaser.Group {
        ship: Ship;
        originalXPosition;
        originalYPosition;
        person;
        constructor(game: Phaser.Game, ship: Ship) {
            super(game);
            this.createPeople();
            this.callAll('animations.add', 'animations', 'wave', [0, 1, 2, 3, 4], 15, true);
            this.callAll('play', null, 'wave');
            this.game.physics.arcade.enable(this);
            this.scale.set(0.62);
            this.callAll('body.collideWorldBounds', '', true);
            this.ship = ship;
        }

        createPeople() {
            for (var i = 0; i < 10; i++) {
                var num = this.game.rnd.between(200, 9000);
                this.person = this.game.add.sprite(num, 1200, 'JumpingMale', 1);
                this.add(this.person);
            }
           // console.debug(this.length.toString());
        }

    }
}