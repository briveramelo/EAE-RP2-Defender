module Jelicopter.Client {

    export class ParatrooperSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawnTroopers(paraTroopersToSpawn: number) {
            for (var i: number = 0; i < paraTroopersToSpawn; i++) {
                var trooper = this.level.paratroopers.getFirstDead(false);
                var playerX: number = this.level.playerShip.position.x;
                trooper.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), 0);
                trooper.comeAlive();
            }
        }
    }
}