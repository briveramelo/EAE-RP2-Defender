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
                //this.checkUFOToPlayerOverlaps();
            }
            this.checkHumanHumanOverlaps();
            //this.checkEnemyBulletOverlaps();
            this.checkPlayerBulletOverlaps();
            //this.checkEnemyMissileOverlaps();
        }

        checkHumanHumanOverlaps() {
            this.level.people.forEach(function (person1: Person) {
                if (person1.alive && person1.isFlying) {
                    this.level.people.forEach(function (person2: Person) {
                        if (person2.alive) {
                            if (person1.myCollider.isColliding(person2.myCollider)) {
                                var velDiff: number = new Phaser.Point(person1.body.velocity.x - person2.body.velocity.x, person1.body.velocity.y - person2.body.velocity.y).getMagnitude();
                                if (velDiff > person1.maxTotalSpeedBeforeDeath) {
                                    person1.kill(Points.HumanToHuman);
                                    person2.kill();                                    
                                }
                            }
                        }
                    }, this);
                }
            }, this);
        }

        checkEnemyMissileOverlaps() {
            this.level.enemyMissiles.forEachAlive(function (missile) {
                //if (this.level.playerShip.alive && this.level.playerShip.myCollider.isColliding(missile.myCollider)) {
                //    this.level.playerShip.takeDamage();
                //    missile.kill();
                //}
                if (this.isOverlapping(missile, this.level.hospital)) {
                    this.level.hospital.takeDamage();
                    missile.kill();
                }

                this.level.people.forEach(function (person: Person) {
                    if (person.alive) {
                        if (person.myCollider.isColliding(missile.myCollider)) {
                            this.level.scoreboard.updateScore(30);
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
                            bullet.kill();
                            person.kill(Points.Human, true);
                            if (this.level.people.countLiving() == 0) {
                                this.level.roundManager.startNewRound();
                            }
                        }
                    }
                }, this);

                this.level.ufos.forEachAlive(function (ufo: UFO) {
                    if (ufo.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.updateScore(30);
                        bullet.kill();
                        ufo.kill();
                        this.level.explosionManager.particleBurst(ufo.position);
                    }
                }, this);

                this.level.bomberUFOs.forEachAlive(function (bomberUFO: UFO) {
                    if (bomberUFO.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.updateScore(50);
                        bullet.kill();
                        bomberUFO.kill();
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