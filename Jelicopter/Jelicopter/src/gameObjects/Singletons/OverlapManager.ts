module Jelicopter.Client {

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
            this.checkEnemyMissileOverlaps();
        }

        checkEnemyMissileOverlaps() {
            this.level.enemyMissiles.forEachAlive(function (missile) {
                if (this.level.playerShip.alive && this.level.playerShip.myCollider.isColliding(missile.myCollider)) {
                    this.level.playerShip.kill();
                    missile.kill();
                }
                if (this.isOverlapping(missile, this.level.hospital)) {
                    if (this.level.hospital.allPatientSaved) {
                        switch (this.level.humanManager.patientSaved) {
                            case 9: this.level.hospital.animations.play('shake9');
                                break;
                            case 8: this.level.hospital.animations.play('shake8');
                                break;
                            case 7: this.level.hospital.animations.play('shake7');
                                break;
                            case 6: this.level.hospital.animations.play('shake6');
                                break;
                            case 5: this.level.hospital.animations.play('shake5');
                                break;
                            case 4: this.level.hospital.animations.play('shake4');
                                break;
                            case 3: this.level.hospital.animations.play('shake3');
                                break;
                            case 2: this.level.hospital.animations.play('shake2');
                                break;
                            case 1: this.level.hospital.animations.play('shake1');
                                break;
                        }
                        this.level.humanManager.patientSaved--;
                        missile.kill();
                        if (this.level.humanManager.patientSaved <= 0) {
                            this.game.state.start('GameOver', true, false);
                        }
                    }
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
                    }
                }, this);

                this.level.bomberUFOs.forEachAlive(function (bomberUFO: UFO) {
                    if (bomberUFO.myCollider.isColliding(bullet.myCollider)) {
                        this.level.scoreboard.updateScore(50);
                        bullet.kill();
                        bomberUFO.kill();
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