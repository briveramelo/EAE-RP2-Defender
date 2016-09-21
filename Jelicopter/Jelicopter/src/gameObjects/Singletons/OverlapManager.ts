﻿module Jelicopter.Client {

    export class OverlapManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: Level01;

        constructor(game: Phaser.Game, level: Level01) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        update() {
            if (this.level.playerShip.alive) {
                this.checkUFOToPlayerOverlaps();
            }
            this.checkEnemyBulletOverlaps();
            this.checkPlayerBulletOverlaps();            
        }

        checkPlayerBulletOverlaps() {
            this.level.playerBullets.forEachAlive(function (bullet) {
                this.level.people.forEach(function (person: Person) {
                    if (person.alive) {
                        if (person.myCollider.isColliding(bullet.myCollider)) {
                            //this.level.scoreboard.updateScore(30); //Don't award them for killing people
                            bullet.kill();
                            person.kill();
                            //person.destroy();
                        }
                    }
                }, this);

                this.level.ufos.forEachAlive(function (ufo: UFO) {
                    if (ufo.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.updateScore(30);
                        bullet.kill();
                        ufo.kill();
                    }
                }, this);

            }, this);
        }

        checkUFOToPlayerOverlaps() {
            this.level.ufos.forEachAlive(function (ufo: UFO) {
                if (this.level.playerShip.myCollider.isColliding(ufo.myCollider)) {
                    this.level.playerShip.kill();
                    ufo.kill();
                }
            }, this);
        }

        checkEnemyBulletOverlaps() {
            this.level.enemyBullets.forEachAlive(function (bullet) {
                if (this.level.playerShip.alive && this.level.playerShip.myCollider.isColliding(bullet.myCollider)) {
                    this.level.playerShip.kill();
                    bullet.kill();
                }
                else {
                    this.level.people.forEach(function (person: Person) {
                        if (person.alive) {
                            if (person.myCollider.isColliding(bullet.myCollider)) {
                                //this.level.scoreboard.updateScore(30); //Don't award them for killing people
                                bullet.kill();
                                person.kill();
                                //person.destroy();
                            }
                        }
                    }, this);
                }
            }, this);
        }
      
        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }

    }
}