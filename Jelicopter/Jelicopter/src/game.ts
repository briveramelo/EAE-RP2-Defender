module Jelicopter.Client {

    export class GameEngine extends Phaser.Game {

        mainMenu: MainMenu;
        mainGame: MainGame;
        gameOver: GameOver;
        gameSize: Phaser.Point = new Phaser.Point(1880, 850);

        constructor() {
            super(1880, 850, Phaser.AUTO, 'content', null);            

            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);

            this.mainMenu = new MainMenu(this);
            this.state.add('MainMenu', this.mainMenu, false);

            this.mainGame = new MainGame(this.gameSize);
            this.state.add('MainGame', this.mainGame, false);

            this.gameOver = new GameOver(this.mainGame);
            this.state.add('GameOver', this.gameOver, false);
            this.state.add('Credits', Credits, false);

            this.state.start('Boot');            
        }

        resizeGame() {
            var width = window.innerWidth;
            var height = window.innerHeight;

            var width_constrained = (height * (this.gameSize.x / this.gameSize.y));
            var height_constrained = (width * (this.gameSize.y / this.gameSize.x));

            if (width_constrained > width) {
                height = height_constrained;
            }
            else if (height_constrained > height) {
                width = width_constrained;
            }

            this.scale.setMinMax(0, 0, width, height);
            this.scale.refresh();
        }
    }
}

var gameEngine;

window.onload = () => {
    gameEngine = new Jelicopter.Client.GameEngine();
};

window.onresize = () => {
    gameEngine.resizeGame();    
};