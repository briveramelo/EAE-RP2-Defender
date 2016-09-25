module Jelicopter.Client {

    export class Maps extends Phaser.Group {
        map_back;
        map_mid;
        map_frame;
        constructor(game: Phaser.Game, level: MainGame) {
            super(game);
            this.map_frame = this.game.add.sprite(250, 45, 'MapCityFrame');
            this.map_back = this.game.add.sprite(250, 40, 'MapCityMid');
            this.map_mid = this.game.add.sprite(250, 40, 'MapCityBack');

            this.add(this.map_frame);
            this.add(this.map_mid);
            this.add(this.map_back);
           
            this.fixedToCamera = true;
           
        }
    }
}