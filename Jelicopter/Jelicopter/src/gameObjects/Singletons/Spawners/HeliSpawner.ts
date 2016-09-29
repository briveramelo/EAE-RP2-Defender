module Jelicopter.Client {

    export class HeliSpawner{

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawn(shipsToSpawn: number) {
            for (var i: number = 0; i < shipsToSpawn; i++) {
                var heli = this.level.helis.getFirstDead(false);
                var playerX: number = this.level.playerShip.position.x;
                var spawnX1: number = this.game.rnd.between(playerX - this.level.backgroundImageWidth / 3, playerX - this.level.backgroundImageWidth / 6);
                var spawnX2: number = this.game.rnd.between(playerX + this.level.backgroundImageWidth / 3, playerX + this.level.backgroundImageWidth / 6);
                var spawnY: number = this.game.rnd.between(this.level.heightOffset, this.level.gameSize.y / 2);

                var spawnX = this.game.rnd.sign() == 1 ? spawnX1 : spawnX2;
                heli.reset(spawnX, spawnY );
                heli.comeAlive();
            }            
        }
    }
}