module Jelicopter.Client {    

    export enum EnemyType {
        Heli = 0,
        Paratrooper = 1,
        Vehicle =2

    }

    export class RoundManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        roundNumber: number;
        roundIndex: number;
        roundText;
        waveText;
        showCount: number;
        isTransitioningBetweenRounds: boolean;
        people: Phaser.Group;

        currentChallengeIndex: number;
        maxHelisOnScreen: number[];
        minHelisOnScreen: number[];
        maxPeopleOnScreen: number[];
        minPeopleOnScreen: number[];        
        maxParaTroopersOnScreen: number[];
        minParaTroopersOnScreen: number[];

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);

            this.currentChallengeIndex = 0;
            this.maxHelisOnScreen = [];
            this.minHelisOnScreen = [];
            this.maxParaTroopersOnScreen = [];
            this.minParaTroopersOnScreen = [];
            this.maxPeopleOnScreen = [];
            this.minPeopleOnScreen = [];

            for (var i: number = 0; i < 100; i++) {
                this.maxHelisOnScreen[i] = 1 + Math.ceil(i / 4);
                this.minHelisOnScreen[i] = 1 + Math.floor(i / 6);

                this.maxParaTroopersOnScreen[i] = 1 + Math.ceil(i / 4);
                this.minParaTroopersOnScreen[i] = 1 + Math.ceil(i / 6);


                this.maxPeopleOnScreen[i] = 4 + Math.ceil(i / 8);
                this.minPeopleOnScreen[i] = 4 + Math.ceil(i / 12);
            }

            this.level.heliSpawner.spawn(this.maxHelisOnScreen[0]);
            this.level.personSpawner.spawn(this.maxPeopleOnScreen[0]);
            this.level.paratrooperSpawner.spawn(this.maxPeopleOnScreen[0]);

        }

        checkToRespawn(enemyType: EnemyType) {
            switch (enemyType) {
                case EnemyType.Heli:
                    if (this.level.helis.countLiving() <= this.minHelisOnScreen[this.currentChallengeIndex]) {
                        this.currentChallengeIndex++;

                        var numHelisToSpawn = this.maxHelisOnScreen[this.currentChallengeIndex] - this.level.helis.countLiving();
                        var numPeopleToSpawn = this.maxPeopleOnScreen[this.currentChallengeIndex] - this.level.allPeople.countLiving();
                        var numParaTroopersToSpawn = this.maxParaTroopersOnScreen[this.currentChallengeIndex] - this.level.paratroopers.countLiving();

                        this.level.heliSpawner.spawn(numHelisToSpawn);
                        this.level.personSpawner.spawn(numPeopleToSpawn);
                        this.level.paratrooperSpawner.spawn(numParaTroopersToSpawn);

                    }
                    break;
                case EnemyType.Paratrooper:

                    break;
                case EnemyType.Vehicle:

                    break;
            }
        }        
    }

}