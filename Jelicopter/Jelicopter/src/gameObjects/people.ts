module Jelicopter.Client {

    export class People extends Phaser.Group {
        ship: Ship;
        originalXPosition;
        originalYPosition;
        person;
        constructor(game: Phaser.Game, ship: Ship) {
            super(game);
            this.ship = ship;
            this.createPeople();

            this.callAll('animations.add', 'animations', 'wave', [0, 1, 2, 3, 4], 15, true);
            this.callAll('play', null, 'wave');
            this.game.physics.arcade.enable(this);
            this.scale.set(0.62);
            this.callAll('body.collideWorldBounds', '', true);
        }

        createPeople() {
            for (var i = 0; i < 10; i++) {
                var xSpawnPosition = this.game.rnd.between(this.ship.position.x - 5760/2, this.ship.position.x + 5760/2);
                this.person = this.game.add.sprite(xSpawnPosition, 550, 'JumpingMale', 1);
                this.add(this.person);
                this.person.position.x = xSpawnPosition;
                this.person.position.y = 550;
            }
           // console.debug(this.length.toString());
        }

    }
}