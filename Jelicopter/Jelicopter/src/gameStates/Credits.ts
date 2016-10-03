module Jelicopter.Client {
    export class Credits extends Phaser.State {

        background: Phaser.Sprite;
        joystick: Phaser.SinglePad;
        
        create() {
            //swap this out for another credits screenpppp
            this.background = this.add.sprite(0, 0, 'GameOver');

            this.game.input.gamepad.start();
            this.joystick = this.game.input.gamepad.pad1;
        }
        
        actionOnClick() {
            this.game.state.start('GameOver', true, false);
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR) ||
                this.joystick.isDown(Phaser.Gamepad.BUTTON_0) ||
                this.game.input.activePointer.leftButton.isDown) {
                this.actionOnClick();
            }
        }
    }
}