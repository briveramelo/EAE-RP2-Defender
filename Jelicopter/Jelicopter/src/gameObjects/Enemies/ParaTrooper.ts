﻿module Jelicopter.Client {

    export class ParaTrooper extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        person;
        parachute;
        parachuteCollider: CircleCollider;
        personCollider: CircleCollider;
        gun;
        isSafeOnGround: boolean = false;
        positionOffset: Phaser.Point = new Phaser.Point(-64, -64);
        missileTimerAllowsShooting: boolean = true;
        maxMissileShootDistance: number = 900;
        timeToShootMissile: number = 3;

        constructor(game: Phaser.Game, x: number, y: number, level: MainGame) {
            super(game, x, y, null, 0);
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);

            this.scale.setTo(0.8);
            this.person = this.game.add.sprite(0, 0, 'Bob');
            this.person.anchor.setTo(0.5);
            this.person.pivot.set(0, 0);

            this.parachute = this.game.add.sprite(10, -40, 'Parachute');
            this.parachute.anchor.setTo(0.5);
            this.parachute.pivot.set(0, 0);

            this.addChild(this.parachute);
            this.addChild(this.person);
            game.add.existing(this);
        }
        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x - 64, this.position.y - 64);
        }

        update() {
            if (this.alive) {
                this.onGround();
                if (this.position.y < 520) {
                    if (this.children.indexOf(this.parachute) > -1)
                        this.position.y += 1;
                    else
                        this.position.y += 8;
                }
                else {
                    if (this.children.indexOf(this.parachute) > -1) {
                        this.isSafeOnGround = true;
                        this.removeChild(this.parachute);
                        //this.addChild(this.gun);
                    }
                    else if (!this.isSafeOnGround) {
                        this.level.peopleExplosionManager.explodeBody(this.position, PersonType.Male1);
                        this.kill();
                    }
                }
            }
        }

        onGround() {
            if (this.isSafeOnGround) {

                var angleBetweenShipAndTrooper = this.game.physics.arcade.angleBetween(this.level.playerShip, this);
                if (angleBetweenShipAndTrooper < 3 && angleBetweenShipAndTrooper > 1.6) {
                    this.person.frame = 0; // Player is to the right of paratrooper
                    this.person.scale.x = 1;
                }
                else if (angleBetweenShipAndTrooper > 0 && angleBetweenShipAndTrooper < 1.25) {
                    this.person.frame = 0;
                    this.person.scale.x = -1;// Player is to the left of paratrooper
                }
                else {
                    this.person.frame = 1;
                    this.person.scale.x = 1;//center
                }
                this.checkToShoot();
            }
        }

        checkToShoot(): void {
            if (this.level.playerShip.alive) {
                if (this.myPosition().distance(this.level.playerShip.myPosition()) < this.maxMissileShootDistance && this.missileTimerAllowsShooting) {
                    this.shootMissile();
                }
            }

        }

        shootMissile(): void {
            var myBullet = this.level.enemyBullets.getFirstDead(false);
            myBullet.reset(this.position.x, this.position.y);
            var angleOfShotRadians;
            if (this.person.frame == 1) {
                angleOfShotRadians = -90;
            }
            else {
                if (this.person.scale.x == 1)
                    angleOfShotRadians = -45;
                else if (this.person.scale.x == -1) {
                    myBullet.reset(this.position.x - 20, this.position.y);
                    angleOfShotRadians = -135;

                }
            }


            myBullet.lifespan = 4500;
            myBullet.angle = angleOfShotRadians;
            this.game.physics.arcade.velocityFromAngle(angleOfShotRadians, 400, myBullet.body.velocity);
            this.resetMissileShooting();
        }

        kill() {
            this.level.peopleExplosionManager.explodeBody(this.position, PersonType.Male1);
            this.level.soundManager.playSound(SoundFX.PersonDeath);          

            super.kill();

            return this;
        }

        resetMissileShooting(): void {
            this.missileTimerAllowsShooting = false;
            this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShootMissile, this.setMissileShootingToOk, this);
        }

        setMissileShootingToOk(): void {
            this.missileTimerAllowsShooting = true;
        }



    }
}