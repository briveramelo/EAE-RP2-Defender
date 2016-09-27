module Jelicopter.Client {

    export class GameEngine extends Phaser.Game {

        mainGame: MainGame;
        gameOver: GameOver;
        constructor() {
            super(1600, 576, Phaser.AUTO, 'content', null);            

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);

            this.mainGame = new MainGame();
            this.state.add('MainGame', this.mainGame, false);

            this.gameOver = new GameOver(this.mainGame);
            this.state.add('GameOver', this.gameOver, false);

            this.state.start('Boot');

        }
    }
}

window.onload = () => {
    new Jelicopter.Client.GameEngine();
};