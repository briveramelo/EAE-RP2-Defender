module Jelicopter.Client {

    class Round {        
        constructor(
            public personCount: number,
            public paragliderPlaneCount: number,
            public vehicleCount: number
        ) {}
    }

    export class RoundManager extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        rounds: Round[];
        roundNumber: number;
        roundIndex: number;
        roundText;
        waveText;
        showCount: number;
        isTransitioningBetweenRounds: boolean;
        people: Phaser.Group;

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group) {
            super(game, 0, 0, 'EnemyBullet');
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);

            this.rounds = [];
            this.rounds[0] = new Round(10, 0, 0);
            this.rounds[1] = new Round(30, 3, 0);
            this.rounds[2] = new Round(40, 3, 0);
            this.rounds[3] = new Round(10, 4, 0);
            this.rounds[4] = new Round(14, 4, 3);
            this.rounds[5] = new Round(17, 4, 3);
            this.rounds[6] = new Round(20, 5, 4);
            this.rounds[7] = new Round(25, 5, 4);
            this.rounds[8] = new Round(30, 5, 5);

            this.roundNumber = 0;
            this.roundIndex = -1;

            this.createRoundText();
            this.createWaveText();
        }

        update() {
            if (this.people.countLiving() == 0 &&
                this.level.ufos.countLiving() == 0 &&
                !this.level.roundManager.isTransitioningBetweenRounds) {

                this.startNewRound();
            }
        }

        createRoundText() {
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            this.roundText = this.game.add.text(this.game.width/2-55, 200, "Round: 1", style);
            this.roundText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.roundText.fixedToCamera = true;
        }

        createWaveText() {
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            this.waveText = this.game.add.text(this.game.width / 2 - 125, 100, "", style);
            this.waveText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.waveText.fixedToCamera = true;
        }

        displayNewRound() {
            this.roundText.text = 'Round: ' + this.roundNumber;
            this.showCount = 0;
            this.showRound();
        }

        displayUFOWave() {
            this.waveText.text = 'INCOMING WAVE';
            this.showCount = 0;
            this.showWave();
        }

        showRound() {
            var show: boolean = (this.showCount % 2 == 0);
            var textToShow: string = show ? 'Round: ' + this.roundNumber : '';
            this.roundText.text = textToShow;
            var showTime: number = show ? .8 : 0.3;
            this.showCount++;
            if (this.showCount <= 7) {
                this.game.time.events.add(Phaser.Timer.SECOND * showTime, this.showRound, this);
            }
        }        

        showWave() {
            var show: boolean = (this.showCount % 2 == 0);
            var textToShow: string = show ? 'INCOMING WAVE': '';
            this.waveText.text = textToShow;
            var showTime: number = show ? .8 : 0.3;
            this.showCount++;
            if (this.showCount <= 7) {
                this.game.time.events.add(Phaser.Timer.SECOND * showTime, this.showWave, this);
            }
        }

        initiateUFOWave() {
            this.displayUFOWave();            
            this.game.time.events.add(Phaser.Timer.SECOND * 4.1, this.level.bomberUFOSpawner.spawnShips, this);
        }

        startNewRound() {
            this.roundIndex++;
            this.roundNumber++;

            this.level.hospital.resetHospital();
            this.displayNewRound();
            this.isTransitioningBetweenRounds = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 4.1, this.endRoundTransition, this);
            //this.game.time.events.add(Phaser.Timer.SECOND * 4.1, this.triggerSpawning, this);
            this.triggerSpawning();
        }

        triggerSpawning() {
            this.level.personSpawner.spawn(this.rounds[this.roundIndex].personCount);
            this.level.ufoSpawner.spawnShips(this.rounds[this.roundIndex].paragliderPlaneCount);
            //this.level.ufoSpawner.spawnShips(this.rounds[this.roundIndex].vehicleCount);
        }

        endRoundTransition() {
            this.isTransitioningBetweenRounds = false;
        }
    }

}