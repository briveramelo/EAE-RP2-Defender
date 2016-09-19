module Jelicopter.Client {

    export class CircleCollider {

        constructor(mySprite: Phaser.Sprite, radius: number, offset: Phaser.Point) {
            this.mySprite = mySprite;
            this.myRadius = radius;
            this.offset = offset;
        }

        offset: Phaser.Point;
        mySprite: Phaser.Sprite;
        myRadius: number;
        myPosition(): Phaser.Point {
            return new Phaser.Point(this.mySprite.position.x + this.offset.x, this.mySprite.position.y + this.offset.y);
        }

        isColliding(otherCollider: CircleCollider): boolean {
            if (this.myPosition().distance(otherCollider.myPosition()) < (this.myRadius + otherCollider.myRadius)) {
                return true;
            }
            return false;
        }

    }
}