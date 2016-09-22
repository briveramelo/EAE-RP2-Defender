module Jelicopter.Client {

    export class UFO extends Phaser.Sprite {

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, 'UFO');
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(64, 64);
            this.animations.add('ufo_fly', [0, 1, 2], 30, true);
            game.add.existing(this);
            // Physics
            this.myCollider = new CircleCollider(this, 50, this.positionOffset);
            game.physics.enable(this);
            this.body.setCircle(20);
            this.shipSpeed = new Phaser.Point(this.game.rnd.sign() * 250, 100);
            this.kill();      
        }

        goStraight: boolean;
        myCollider: CircleCollider;
        level: MainGame;
        shipSpeed: Phaser.Point;
        timeToMoveStraight: number = 1;
        timeToShoot: number = 3;
        timeMoving: number = 0;
        shootSpeed: number = 100;
        maxShootDistance: number = 900;
        positionOffset: Phaser.Point = new Phaser.Point(-64, -64);
        timerAllowsShooting: boolean = true;
        worldHeightShiftPadding: number = 200;
        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x - 64, this.position.y - 64);
        }

        update() {
            if (this.alive) {
                this.animations.play('ufo_fly');
                this.checkToShoot();
            }
        }

        checkToShoot() :void{
            if (this.level.playerShip.alive && this.alive) {
                if (this.myPosition().distance(this.level.playerShip.myPosition()) < this.maxShootDistance && this.timerAllowsShooting) {
                    if (this.alive) {
                        if (this.level.playerShip.alive) {
                            this.shoot();
                        }
                    }
                }                
            }
        }

        comeAlive() :void{
            this.revive();
            this.timerAllowsShooting = true;
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

        shoot(): void{
            var shootDir = new Phaser.Point(this.level.playerShip.myPosition().x - this.myPosition().x, this.level.playerShip.myPosition().y - this.myPosition().y);
            var myBullet = this.level.enemyBullets.getFirstDead(false);
            myBullet.reset(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
            var angleOfShot = Math.atan2(shootDir.y, shootDir.x) * 180 / Math.PI;
            this.game.physics.arcade.velocityFromAngle(angleOfShot, 400, myBullet.body.velocity);
            myBullet.lifespan = 4500;

            this.resetShooting();
        }

        resetShooting() : void {
            this.timerAllowsShooting = false;
            this.game.time.events.add(Phaser.Timer.SECOND * this.timeToShoot, this.setShootingToOk, this);
        }

        setShootingToOk() : void {
            this.timerAllowsShooting = true;
        }

    }

}