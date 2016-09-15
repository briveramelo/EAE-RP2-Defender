﻿module Jelicopter.Client {

    export class Level01 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Ship;

        create() {
            
            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.background = this.add.sprite(0, 0, 'GameBackground');
            this.player = new Ship(this.game, this.world.centerX, this.world.centerX);
            this.player.anchor.setTo(0, 5);

            //this.game.debug.text("Use Right and Left arrow keys to move the bat", 0, this.world.height, "red");
            console.log("Created level 01");
        }

    }

}