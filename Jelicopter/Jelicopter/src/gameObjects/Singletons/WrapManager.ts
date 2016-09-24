module Jelicopter.Client {

    export class WrapManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;


        constructor(game: Phaser.Game, level: MainGame) {
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

        wrapObjectsAroundTheWorld(playerShip, backgroundImageWidth) {
            var i: number = 0;
            this.level.allObjects.forEach(function (object) {
                if (object.alive) {
                    var dist = Math.abs(object.position.x - playerShip.position.x);
                    if (Math.abs(object.position.x - playerShip.position.x) > (backgroundImageWidth / 2)) {
                        var newRightDistanceAway = Math.abs(playerShip.position.x - (object.position.x + backgroundImageWidth));
                        var newLeftDistanceAway = Math.abs(playerShip.position.x - (object.position.x - backgroundImageWidth));
                        var shiftRightWard: boolean = newRightDistanceAway < newLeftDistanceAway;
                        object.position.x += (shiftRightWard ? 1 : -1) * backgroundImageWidth;
                    }
                }
                i++;
            });
        }

        wrapBackgroundsAroundTheWorld(playerShip, backgroundImageWidth) {
            this.level.allBackgrounds.forEach(function (background) {
                if (Math.abs(background.position.x - playerShip.position.x) > (backgroundImageWidth * 2)) {
                    var shiftRightWard: boolean = playerShip.body.velocity.x > 0;
                    background.position.x += (shiftRightWard ? 1 : -1) * backgroundImageWidth * 3;
                }
            }, this);
        }
    }
}