module Jelicopter.Client {

    export class Person extends Phaser.Sprite {

        myCollider: CircleCollider;
        ship: Ship;
        game: Phaser.Game;

        constructor(game: Phaser.Game, ship: Ship, x: number, y: number) {
            super(game, x, y, 'JumpingMale');
            this.game = game;
            this.ship = ship;
            this.anchor.set(0.5);
            this.myCollider = new CircleCollider(this, 30, new Phaser.Point(0, 0));
            var xSpawnPosition = this.game.rnd.between(this.ship.position.x - 5760 / 2, this.ship.position.x + 5760 / 2);

            this.game.add.sprite(0, 0, 'JumpingMale', 1);
            this.position = new Phaser.Point(xSpawnPosition, 780);
            game.add.existing(this);
            game.physics.enable(this);
            this.body.setCircle(20);

            this.animations.add('wave', [0, 1, 2, 3, 4], 15, true);
            this.play('wave');
            this.scale.set(0.62);
            this.revive();      
        }

        update() {
            this.play('wave');
        }
        
    }

}
