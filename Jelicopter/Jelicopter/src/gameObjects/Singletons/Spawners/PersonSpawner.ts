﻿module Jelicopter.Client {

    export class PersonSpawner {

        game: Phaser.Game;
        level: MainGame;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
        }

        spawn(peopleToSpawn: number) {
            for (var i: number = 0; i < peopleToSpawn; i++) {
                this.spawnPerson();
            }            
        }

        spawnPerson() {
            var person: Person = this.getRandomPerson();
            var playerX: number = this.level.playerShip.position.x;
            var spawnX: number = this.game.rnd.between(playerX - this.level.backgroundImageWidth / 2, playerX + this.level.backgroundImageWidth / 2);
            var spawnY: number = this.level.gameSize.y;
            person.spawn(new Phaser.Point(spawnX, spawnY));
        }

        getRandomPerson():Person {
            var randomNumber = this.game.rnd.integerInRange(0, 60);
            var person: Person = this.level.allPeople.getRandom(randomNumber, randomNumber);
            if (!person.alive) {
                return person;
            }
            return this.getRandomPerson();
        }


    }
}