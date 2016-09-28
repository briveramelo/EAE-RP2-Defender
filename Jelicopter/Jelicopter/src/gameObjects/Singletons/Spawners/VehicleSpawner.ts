module Jelicopter.Client {

    export class VehicleSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawn(vehiclesToSpawn: number) {
                     
            for (var i: number = 0; i < (vehiclesToSpawn); i++) {
                var vehicle = this.level.vehicles.getFirstDead(false);
                var playerX: number = this.level.playerShip.position.x;
                var spawnX: number = this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2);
                var spawnY: number = this.level.gameSize.y-60;
                console.debug("Vehicle position " + spawnX);
                vehicle.reset(spawnX, spawnY);
            }
        }
    }
}
