module Jelicopter.Client {

    export class Vehicle extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        tank;
        myCollider;
        floorHeight;


        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, null, 0);
            this.level = level;
            this.anchor.setTo(0.5);
            this.pivot.set(0, 0);
            

            this.tank = this.game.add.sprite(0, 0, 'Tank');
            this.tank.anchor.setTo(0.5);
            this.tank.pivot.set(0, 0);
            this.addChild(this.tank);

            //this.parachute = this.game.add.sprite(10, -40, 'Parachute');
            //this.parachute.anchor.setTo(0.5);
            //this.parachute.pivot.set(0, 0);
            //this.addChild(this.parachute);


            this.myCollider = new CircleCollider(this, 50, new Phaser.Point(0, 0));
            game.physics.enable(this);
            //this.body.setCircle(20);
            //this.body.gravity.y = 600;
            game.add.existing(this);
            this.floorHeight = this.level.gameSize.y - 65;
            //this.lifeCount = 0;
            this.tank.animations.add('moveTank', [0, 3], 15, true);
            this.tank.play('moveTank');
            super.kill();
        }

        update() {
           
            this.position.x -= 4;
        }

        reset(x: number, y: number) {
            
            //this.removeChild(this.person);
            //this.addChild(this.parachute);
            //this.addChild(this.person);
            //this.body.gravity.y = 0;
            super.reset(x, y);
            return this;
        }
    }
}