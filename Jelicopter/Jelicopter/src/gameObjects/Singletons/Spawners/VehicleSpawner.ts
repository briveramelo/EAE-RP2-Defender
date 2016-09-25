module Jelicopter.Client {

    export class VehicleSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawn(vehiclesToSpawn: number) {
            //for (var i: number = 0; i < vehiclesToSpawn; i++) {
            //    var vehicle: Person = this.level.vehicles.getFirstDead(false);
            //    var playerX: number = this.level.playerShip.position.x;
            //    var spawnX = this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2);
            //    vehicle.spawn(new Phaser.Point(spawnX, null));
            //}
        }
    }
}