﻿module Jelicopter.Client {

    export class Bullet extends Phaser.Group {
        bulletTime: number = 0;
        bullet;
        bulletSpeed: number;
        constructor(game: Phaser.Game) {
            super(game);
            this.enableBody = true;
            this.physicsBodyType = Phaser.Physics.ARCADE;

            this.createMultiple(5, 'invisibleDot');
            this.forEach(function (bullet) {
                bullet.myCollider = new CircleCollider(bullet, 5, new Phaser.Point(0, 0));
            }, this);
            this.setAll('anchor.x', 0.5);
            this.setAll('anchor.y', 0.5);
            this.bulletSpeed = 2000;
        }
    }
}