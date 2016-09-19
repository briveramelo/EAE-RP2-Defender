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
            game.physics.enable(this);
            this.body.setCircle(20);
            this.kill();      
        }

        level: Level01;
        shipSpeed: Phaser.Point = new Phaser.Point(100, 100);
        timeToMoveStraight: number = 1;
        timeToShoot: number = 1.5;
        timeMoving: number = 0;
        shootSpeed: number = 100;
        maxShootDistance: number = 900;
        positionOffset: Phaser.Point = new Phaser.Point(-64, -64);
        timerAllowsShooting: boolean = true;

        update() {
            this.animations.play('ufo_fly');
            this.checkToShoot();
        }

        checkToShoot() :void{
            if (this.level.player.alive && this.alive) {
                var myPos: Phaser.Point = new Phaser.Point(this.position.x + this.positionOffset.x, this.position.y + this.positionOffset.y);
                //console.log(myPos.distance(this.level.player.position));
                if (myPos.distance(this.level.player.position) < this.maxShootDistance && this.timerAllowsShooting) {
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
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.kill, this);
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
                this.body.velocity.y = (this.game.rnd.sign()) * this.shipSpeed.y;
            }
            if (this.alive) {
                this.game.time.events.add(Phaser.Timer.SECOND * this.timeToMoveStraight, this.move, this);
            }
        }

        shoot() :void{            
            var shootDir = new Phaser.Point(this.level.player.position.x - this.position.x, this.level.player.position.y - this.position.y);
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