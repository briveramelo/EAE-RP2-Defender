module Jelicopter.Client {

    export class RoundManager {

        game: Phaser.Game;
        level: Level01;
        roundNumber: number;
        roundText;

        constructor(game: Phaser.Game, level: Level01) {
            this.game = game;
            this.level = level;

            this.roundNumber = 0;
            this.createRoundText();
            this.moveToNextRound();
        }

        createRoundText() {
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            this.roundText = this.game.add.text(this.game.width/2-55, 200, "Round: 1", style);
            this.roundText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.roundText.fixedToCamera = true;
        }

        moveToNextRound() {
            this.roundNumber++;
            this.roundText.text = 'Round: ' + this.roundNumber;
            this.showCount = 0;
            this.showRound();
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
        showCount: number;
    }


}