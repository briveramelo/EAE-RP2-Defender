module Jelicopter.Client {

    export class People extends Phaser.Sprite {
        ship: Ship;
        constructor(game: Phaser.Game, x: number, y: number, ship: Ship) {
            super(game, x, y, 'People',1);
            this.animations.add('wave', [0, 1, 2, 3, 4], 15, true);
            this.game.physics.arcade.enable([this]);
            game.add.existing(this);
            this.body.collideWorldBounds = true;
            this.scale.setTo(0.6);
            this.ship = ship;
        }

        update() {
            this.animations.play('wave');
            if (this.checkOverlap(this.ship, this)) {
                //text.text = 'Drag the sprites. Overlapping: true';
                console.log("Overlapping ya");
            }
            else {
                //text.text = 'Drag the sprites. Overlapping: false';
                console.log("Not Overlapping");
            }

        }

        //collisionHandler(obj1, obj2) {
        //    //this.game.stage.backgroundColor = '#992d2d';
        //    console.log("Collission detected.");

        //}

        checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    }

    }
}