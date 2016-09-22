module Jelicopter.Client {

    export class OverlapManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
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
            this.checkEnemyMissileOverlaps();
        }

        checkEnemyMissileOverlaps() {
            this.level.enemyMissiles.forEachAlive(function (missile) {
                if (this.level.playerShip.alive && this.level.playerShip.myCollider.isColliding(missile.myCollider)) {
                    this.level.playerShip.takeDamage();
                    missile.kill();
                }
                if (this.isOverlapping(missile, this.level.hospital)) {
                    this.level.hospital.takeDamage();
                    missile.kill();
                }

                this.level.people.forEach(function (person: Person) {
                    if (person.alive) {
                        if (person.myCollider.isColliding(missile.myCollider)) {
                            //this.level.scoreboard.updateScore(30); //Don't award them for killing people
                            missile.kill();
                            person.kill();
                        }
                    }
                }, this);

            }, this);      
        }

        checkPlayerBulletOverlaps() {
            this.level.playerBullets.forEachAlive(function (bullet) {
                this.level.people.forEach(function (person: Person) {
                    if (person.alive) {
                        if (person.myCollider.isColliding(bullet.myCollider)) {
                            //this.level.scoreboard.updateScore(30); //Don't award them for killing people
                            bullet.kill();
                            person.kill();
                        }
                    }
                }, this);

                this.level.ufos.forEachAlive(function (ufo: UFO) {
                    if (ufo.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.updateScore(30);
                        bullet.kill();
                        ufo.kill();
                        this.level.scoreboard.giveFeedbackOfScore(ufo.position);
                        this.level.explosionManager.particleBurst(ufo.position,"blueShip");
                    }
                }, this);

                this.level.bomberUFOs.forEachAlive(function (bomberUFO: UFO) {
                    if (bomberUFO.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.updateScore(50);
                        bullet.kill();
                        bomberUFO.kill();
                        this.level.explosionManager.particleBurst(bomberUFO.position, "slimeShip");
                        if (this.level.bomberUFOs.countLiving() == 0) {
                            this.level.roundManager.startNewRound();
                        }

                    }
                }, this);

            }, this);
        }

        checkUFOToPlayerOverlaps() {
            this.level.ufos.forEachAlive(function (ufo: UFO) {
                if (this.level.playerShip.myCollider.isColliding(ufo.myCollider)) {
                    this.level.playerShip.takeDamage();
                    ufo.kill();
                    this.level.explosionManager.particleBurst(ufo.position);
                }
            }, this);
        }

        checkEnemyBulletOverlaps() {
            this.level.enemyBullets.forEachAlive(function (bullet) {
                if (this.level.playerShip.alive && this.level.playerShip.myCollider.isColliding(bullet.myCollider)) {
                    this.level.playerShip.takeDamage();
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