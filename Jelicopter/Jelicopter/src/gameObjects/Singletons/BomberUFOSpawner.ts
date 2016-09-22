module Jelicopter.Client {

    export class BomberUFOSpawner extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        hasJustSpawnedShips: boolean;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
        }

        spawnShips() {
            for (var i: number = 0; i < 5; i++) {
                var bomberUFO = this.level.bomberUFOs.getFirstDead(false);
                var playerX: number = this.level.playerShip.position.x;
                bomberUFO.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), this.game.rnd.between(360, 450));
                bomberUFO.comeAlive();
            }
            this.hasJustSpawnedShips = true;
        }        
    }
}