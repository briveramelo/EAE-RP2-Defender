module Jelicopter.Client {

    export class WrapManager extends Phaser.Sprite {

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
                this.wrapObjectsAroundTheWorld(this.level.playerShip, this.level.backgroundImageWidth);
                this.wrapBackgroundsAroundTheWorld(this.level.playerShip, this.level.backgroundImageWidth);
            }
        }

        wrapObjectsAroundTheWorld(playerShip, screenWidth) {
            var i: number = 0;
            this.level.allObjects.forEach(function (object) {
                if (object.alive) {
                    var dist = Math.abs(object.position.x - playerShip.position.x);
                    if (Math.abs(object.position.x - playerShip.position.x) > (screenWidth / 2)) {
                        var shiftRightWard: boolean = playerShip.body.velocity.x > 0;
                        object.position.x += (shiftRightWard ? 1 : -1) * screenWidth;
                    }
                }
                i++;
            });
        }

        wrapBackgroundsAroundTheWorld(playerShip, screenWidth) {
            this.level.backgrounds.forEach(function (background) {
                if (Math.abs(background.position.x - playerShip.position.x) > (screenWidth * 2)) {
                    var shiftRightWard: boolean = playerShip.body.velocity.x > 0;
                    background.position.x += (shiftRightWard ? 1 : -1) * screenWidth * 3;
                }
            }, this);
        }
    }
}