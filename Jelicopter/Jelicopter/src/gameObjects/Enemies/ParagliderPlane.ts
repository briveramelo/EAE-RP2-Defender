module Jelicopter.Client {

    export class ParagliderPlane extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        myCollider: CircleCollider;
        shipSpeed: Phaser.Point;
        positionOffset: Phaser.Point = new Phaser.Point(0,0);

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, 'BomberUFO');
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(64, 64);
            this.animations.add('bomberUFO_fly', [0, 1, 2], 30, true);
            game.add.existing(this);
            // Physics
            this.myCollider = new CircleCollider(this, 50, this.positionOffset);
            game.physics.enable(this);
            this.shipSpeed = new Phaser.Point(this.game.rnd.sign() * 250, 50);
            this.kill();
            this.body.velocity.x = this.shipSpeed.x;            
        }

        update() {
            if (this.alive) {
                this.animations.play('bomberUFO_fly');
                this.move();
            }
        }        

        comeAlive(startPosition: Phaser.Point): void {
            this.revive();
            this.reset(startPosition.x, startPosition.y);     
        }

        kill(): Phaser.Sprite {
            super.kill();
            return this;
        }


        move() {
            this.body.velocity.y = this.shipSpeed.y * Math.cos(this.game.time.elapsedSecondsSince(0));
        }                      

    }
}