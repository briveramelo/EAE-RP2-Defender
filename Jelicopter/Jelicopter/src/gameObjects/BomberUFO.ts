module Jelicopter.Client {

    export class BomberUFO extends Phaser.Sprite {

        goStraight: boolean;
        myCollider: CircleCollider;
        level: MainGame;
        shipSpeed: Phaser.Point;
        worldHeightShiftPadding: number = 100;
        timeToMoveStraight: number = 1;
        timeToShootBullet: number = 1.5;
        timeToShootMissile: number = 3;
        timeMoving: number = 0;
        shootSpeed: number = 100;
        maxBulletShootDistance: number = 900;
        maxMissileShootDistance: number = 500;
        positionOffset: Phaser.Point = new Phaser.Point(-64, -64);
        bulletTimerAllowsShooting: boolean = true;
        missileTimerAllowsShooting: boolean = true;
        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x - 64, this.position.y - 64);
        }

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0,0, 'BomberUFO');
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(64, 64);
            this.animations.add('bomberUFO_fly', [0, 1, 2], 30, true);
            game.add.existing(this);
            // Physics
            this.myCollider = new CircleCollider(this, 50, this.positionOffset);
            game.physics.enable(this);
            this.body.setCircle(20);
            this.shipSpeed = new Phaser.Point(this.game.rnd.sign() * 250, 100);
            this.kill();
        }

        update() {
            if (this.alive) {
                this.animations.play('bomberUFO_fly');
                this.checkToShoot();
            }
        }

        checkToShoot(): void {
            if (this.level.playerShip.alive) {
                if (this.myPosition().distance(this.level.playerShip.myPosition()) < this.maxBulletShootDistance && this.bulletTimerAllowsShooting) {
                    this.shootBullet();
                }
            }
            if (this.level.hospital.alive) {
                if (this.myPosition().distance(this.level.hospital.position) < this.maxMissileShootDistance && this.missileTimerAllowsShooting) {
                    this.shootMissile();
                }
            }
        }

        comeAlive(): void {
            this.revive();
            this.bulletTimerAllowsShooting = true;
            this.missileTimerAllowsShooting = true;
            this.moveStraight();
            this.alternateUpDown();            
        }

        kill(): Phaser.Sprite {
            super.kill();
            return this;
        }


        moveStraight(): void {
            this.body.velocity.x = this.shipSpeed.x;
        }

        alternateUpDown(): void {
            this.goStraight = !this.goStraight;

            if (this.goStraight) {
                this.body.velocity.y = 0;
            }
            else {
                var goUp: boolean = false;
                if (this.position.y > (this.game.height + this.level.heightOffset - this.worldHeightShiftPadding)) {
                    goUp = true;                    
                }
                else if (this.position.y < (this.level.heightOffset + this.worldHeightShiftPadding)) {
                    goUp = false;
                }
                else {
                    goUp = this.game.rnd.sign() == 1;
                }
                this.body.velocity.y = (goUp ? -1 : 1) * this.shipSpeed.y;
            }
            if (this.alive) {
                this.game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight, this.alternateUpDown, this);
            }
        }

        shootBullet(): void {
            var shootDir = new Phaser.Point(this.level.playerShip.myPosition().x - this.myPosition().x, this.level.playerShip.myPosition().y - this.myPosition().y);
            var myBullet = this.level.enemyBullets.getFirstDead(false);
            myBullet.reset(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
            var angleOfShot = Math.atan2(shootDir.y, shootDir.x) * 180 / Math.PI;
            this.game.physics.arcade.velocityFromAngle(angleOfShot, 400, myBullet.body.velocity);

            this.resetBulletShooting();
        }

        shootMissile(): void {
            var shootDir = new Phaser.Point(this.level.hospital.position.x - this.myPosition().x, this.level.hospital.position.y - this.myPosition().y);
            var myMissile = this.level.enemyMissiles.getFirstDead(false);
            myMissile.reset(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
            var angleOfShot = Math.atan2(shootDir.y, shootDir.x) * 180 / Math.PI;
            this.game.physics.arcade.velocityFromAngle(angleOfShot, 400, myMissile.body.velocity);

            this.resetMissileShooting();
        }

        resetBulletShooting(): void {
            this.bulletTimerAllowsShooting = false;
            this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShootBullet, this.setBulletShootingToOk, this);
        }
        resetMissileShooting(): void {
            this.missileTimerAllowsShooting = false;
            this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShootMissile, this.setMissileShootingToOk, this);
        }

        setBulletShootingToOk(): void {
            this.bulletTimerAllowsShooting = true;
        }
        setMissileShootingToOk(): void {
            this.missileTimerAllowsShooting = true;
        }

    }
}