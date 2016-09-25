module Jelicopter.Client {

    export class ParagliderPlaneSpawner{

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawnShips(shipsToSpawn: number) {
            for (var i: number = 0; i < shipsToSpawn; i++) {
                var ufo = this.level.ufos.getFirstDead(false);
                var playerX: number = this.level.playerShip.position.x;
                ufo.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), this.game.rnd.between(160, 665));
                ufo.comeAlive();
            }            
        }
    }
}