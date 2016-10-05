module Jelicopter.Client {

    export class Boot extends Phaser.State {
        preload() {
            //You can preload an image here if you dont want to use text for the loading screen
            this.game.load.text('PixelFont', 'assets/fonts/Kemco_Pixel_Bold.woff', true);
            this.game.load.text('PixelFont', 'assets/fonts/Kemco_Pixel_Bold.ttf', true);
            this.game.load.text('PixelFont', 'assets/fonts/Kemco_Pixel_Bold.svg', true);
            this.game.load.text('PixelFont', 'assets/fonts/Kemco_Pixel_Bold.otf', true);
            this.game.load.text('PixelFont', 'assets/fonts/Kemco_Pixel_Bold.eot', true);
        }

        create() {
            this.stage.setBackgroundColor("000");
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.state.start('Preloader', true, false);
        }
    }

}