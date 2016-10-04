module Jelicopter.Client {

    export class MainMenu extends Phaser.State {
        
        background: Phaser.Sprite;
        logo: Phaser.Sprite;

        create() {
            this.background = this.add.sprite(0, 0, 'TitleScreen');
            this.background.alpha = 0;

            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5);

            this.add.tween(this.background).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 500);


            this.input.onDown.addOnce(this.fadeOut, this);
            this.input.keyboard.addCallbacks(this, this.startGameKeyboard);//.addOnce(this.fadeOut, this);
        }

        fadeOut() {            
            var tweenBackground = this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tweenLogo = this.add.tween(this.logo.scale).to({ x: 2, y:2 }, 5000, Phaser.Easing.Linear.None, true);
            tweenBackground.onComplete.add(this.startGame, this);
        }

        startGameKeyboard() {
            if (this.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
                this.fadeOut();
            }
        }

        startGame() {
            this.game.state.start('MainGame', true, false);
        }

    }

}