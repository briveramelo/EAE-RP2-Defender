module Jelicopter.Client {

    export class ParaTrooper extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        person;
        parachute;
        gun;
        isSafeOnGround: boolean=false;

        constructor(game: Phaser.Game, x: number, y: number, level: MainGame) {
            super(game,x,y,'JumpingFemale',0);
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            this.animations.add('wave', [0, 1, 2, 3, 4], 15, true);
            this.play('wave');
            this.scale.setTo(0.62);

            this.parachute = this.game.add.sprite(-50, -150, 'blood');
            this.gun = this.game.add.sprite(-50, -150, 'blue_fire');
            this.addChild(this.parachute);
            game.add.existing(this);
            //this.bulletSpeed = 1200;
        }

        update() {
            if (this.alive) {             
            this.onGround();
            if (this.position.y < 540) {
                if(this.children.indexOf(this.parachute)>-1)
                    this.position.y += 1;
                else
                    this.position.y += 4;
            }
            else {
                if (this.children.indexOf(this.parachute) > -1) {
                    this.isSafeOnGround = true;
                    this.removeChild(this.parachute);
                    this.addChild(this.gun);
                }
                else if (!this.isSafeOnGround) {
                    this.level.peopleExplosionManager.explodeBody(this.position);
                    this.kill(Points.Human,true);
                }
             }
            }
        }

        onGround() {
            if (this.isSafeOnGround) {
                if (this.level.playerShip.position.x  > this.position.x) {
                    this.gun.frame = 1;
                }
                else {
                    this.gun.frame = 0;
                }
            }
        }

        kill(points?: Points, shouldPlay?: boolean) {
            this.level.peopleExplosionManager.explodeBody(this.position);

            if (shouldPlay) {
                this.level.soundManager.playSound(SoundFX.PersonDeath);
            }
            if (points) {
                this.level.scoreboard.updateScore(points);
            }

            super.kill();

            return this;
        }

       

       

    }
}