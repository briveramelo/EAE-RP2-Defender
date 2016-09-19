module Jelicopter.Client {

    export class CircleCollider {

        constructor(radius:number) {
            this.myRadius = radius;
        }

        myRadius: number;
        isColliding(myPosition:Phaser.Point, incomingPosition: Phaser.Point): boolean {
            if (myPosition.distance(incomingPosition) < this.myRadius) {
                return true;
            }
            return false;
        }

    }
}