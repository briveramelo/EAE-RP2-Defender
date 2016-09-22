﻿module Jelicopter.Client {

    export class UFOSpawner{

        game: Phaser.Game;
        level: Level01;
        shipsSpawned: number =0;

        constructor(game: Phaser.Game, level: Level01) {
            this.game = game;
            this.level = level;
            //this.spawnShips();
        }

        spawnShips() {
            var ufo = this.level.ufos.getFirstDead(false);//, 300, 300);
            var playerX: number = this.level.playerShip.position.x;
            ufo.reset(this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2), this.game.rnd.between(400, 800));
            ufo.comeAlive();
            this.shipsSpawned++;
            if (this.shipsSpawned < 5) {
                this.game.time.events.add(Phaser.Timer.SECOND * 3, this.spawnShips, this);
            }
        }
    }
}