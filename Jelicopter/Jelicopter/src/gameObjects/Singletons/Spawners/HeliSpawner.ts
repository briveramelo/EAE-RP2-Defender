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
                heli.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), this.game.rnd.between(this.level.heightOffset, this.level.gameHeight/2));
                heli.comeAlive();
            }            
        }
    }
}