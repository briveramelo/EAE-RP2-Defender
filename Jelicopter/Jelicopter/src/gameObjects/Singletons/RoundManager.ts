module Jelicopter.Client {

    export class RoundManager  {

        game: Phaser.Game;
        level: MainGame;
        roundNumber: number;
        roundText;
        waveText;
        showCount: number;
        isTransitioningBetweenRounds: boolean;

        constructor(game: Phaser.Game, level: MainGame) {
            this.game = game;
            this.level = level;
            

            this.roundNumber = 0;
            this.createRoundText();
            this.displayNewRound();
            this.createWaveText();
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
            this.roundNumber++;
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
            this.level.hospital.resetHospital();
            this.displayNewRound();
            this.isTransitioningBetweenRounds = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 4.1, this.respawnHumans, this);
            this.game.time.events.add(Phaser.Timer.SECOND * 4.1, this.endRoundTransition, this);
            this.game.time.events.add(Phaser.Timer.SECOND * 4.1, this.level.ufoSpawner.spawnShips, this);
        }

        respawnHumans() {
            this.level.people.forEach(function (person: Person) {
                person.kill();
                person.spawn();
            }, this);
        }

        endRoundTransition() {
            this.isTransitioningBetweenRounds = false;
        }
    }


}