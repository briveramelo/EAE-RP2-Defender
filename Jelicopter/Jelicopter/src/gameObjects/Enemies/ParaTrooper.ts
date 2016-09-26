module Jelicopter.Client {

    export class ParaTrooper extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        person;
        parachute;
        gun;

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
            if (this.position.y < 540) {
                if(this.children.indexOf(this.parachute)>-1)
                    this.position.y += 1;
                else
                    this.position.y += 4;
            }
            else {
                if (this.children.indexOf(this.parachute) > -1) {
                    this.removeChild(this.parachute);
                    this.addChild(this.gun);
                }
                else {
                    this.level.peopleExplosionManager.explodeBody(this.position);
                    this.kill();
                }
                }
            }
        }

        comeAlive(startPosition: Phaser.Point): void {
           
        }

       

       

    }
}