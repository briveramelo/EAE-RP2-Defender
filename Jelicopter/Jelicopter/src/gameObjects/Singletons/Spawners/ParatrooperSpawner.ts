module Jelicopter.Client {

    export class ParatrooperSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawnShips(paraTroopersToSpawn: number) {
            for (var i: number = 0; i < paraTroopersToSpawn; i++) {
                var trooper = this.level.paratroopers.getFirstDead(false);
                var playerX: number = this.level.playerShip.position.x;
                trooper.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), this.game.rnd.between(this.level.heightOffset, this.level.gameHeight / 2));
                trooper.comeAlive();
            }
            //for (var i: number = 0; i < (paraTroopersToSpawn); i++) {
            //    var randomNumber = this.game.rnd.integerInRange(0, 60);
            //    var person: ParaTrooper = this.level.paratroopers.getRandom(randomNumber, randomNumber);
            //    var playerX: number = this.level.playerShip.position.x;
            //    var spawnX: number = this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2);
            //    var spawnY: number = person.floorNumber;
            //    person.spawn(new Phaser.Point(spawnX, spawnY));
            //}
        }
    }
}