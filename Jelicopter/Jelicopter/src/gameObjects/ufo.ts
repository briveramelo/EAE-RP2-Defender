module Jelicopter.Client {

    export class UFO extends Phaser.Sprite {

        constructor(game: Phaser.Game, level: Level01, x: number, y: number) {
            super(game, x, y, 'UFO');
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(64, 64);
            this.animations.add('ufo_fly', [0, 1, 2], 30, true);
            game.add.existing(this);
            // Physics
            this.myCollider = new CircleCollider(this, 50, this.positionOffset);
            game.physics.enable(this);
            this.body.setCircle(20);
            this.kill();      
        }

        myCollider: CircleCollider;
        level: Level01;
        shipSpeed: Phaser.Point = new Phaser.Point(-100, 100);
        timeToMoveStraight: number = 1;
        timeToShoot: number = 1.5;
        timeMoving: number = 0;
        shootSpeed: number = 100;
        maxShootDistance: number = 900;
        positionOffset: Phaser.Point = new Phaser.Point(-64, -64);
        timerAllowsShooting: boolean = true;
        myPosition(): Phaser.Point {
            return new Phaser.Point(this.position.x - 64, this.position.y - 64);
        }

        update() {
            if (this.alive) {
                this.animations.play('ufo_fly');
                this.checkToShoot();

                //DO THIS FOR PLAYER BULLETS
                //this.level.enemyBullets.forEachAlive(function (bullet) {
                //    if (this.myCollider.isColliding(this.myPosition(), bullet.position)) {
                //        this.kill();
                //        bullet.kill();
                //    }
                //}, this);
            }
        }

        checkToShoot() :void{
            if (this.level.player.alive && this.alive) {
                if (this.myPosition().distance(this.level.player.myPosition()) < this.maxShootDistance && this.timerAllowsShooting) {
                    if (this.alive) {
                        if (this.level.player.alive) {
                            this.shoot();
                        }
                    }
                }                
            }
        }

        comeAlive() :void{
            this.revive();
            this.position = new Phaser.Point(100, 500);
            this.timerAllowsShooting = true;

            this.move();
            //this.game.time.events.add(Phaser.Timer.SECOND * 15, this.kill, this);
        }

        kill(): Phaser.Sprite {
            //this.body.position
            super.kill();
            return this;
        }

        goStraight: boolean;

        move() :void {
            this.goStraight = !this.goStraight;

            if (this.goStraight) {
                this.body.velocity.y = 0;
                this.body.velocity.x = this.shipSpeed.x;
            }
            else{
                //this.body.velocity.y = (this.game.rnd.sign()) * this.shipSpeed.y;
            }
            if (this.alive) {
                this.game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight, this.move, this);
            }
        }

        shoot(): void{
            var shootDir = new Phaser.Point(this.level.player.myPosition().x - this.myPosition().x, this.level.player.myPosition().y - this.myPosition().y);
            var myBullet = this.level.enemyBullets.getFirstDead(false);
            myBullet.reset(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
            var angleOfShot = Math.atan2(shootDir.y, shootDir.x) * 180 / Math.PI;
            this.game.physics.arcade.velocityFromAngle(angleOfShot, 400, myBullet.body.velocity);

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