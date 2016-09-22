module Jelicopter.Client {

    export class UFOSpawner{

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
            this.spawnShips();
        }

        spawnShips() {
            for (var i: number = 0; i < 5; i++) {
                var ufo = this.level.ufos.getFirstDead(false);
                var playerX: number = this.level.playerShip.position.x;
                ufo.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), this.game.rnd.between(360, 865));
                ufo.comeAlive();
            }            
        }
    }
}