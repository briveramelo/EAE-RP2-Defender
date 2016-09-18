﻿module Jelicopter.Client {

    export class People extends Phaser.Group {
        ship: Ship;
        constructor(game: Phaser.Game,ship: Ship) {
            super(game);
            var person = this.game.add.sprite(200, 550, 'Male', 1);            
            this.add(person);
            this.callAll('animations.add', 'animations', 'wave', [0, 1, 2, 3, 4], 15, true);
            this.callAll('play', null, 'wave');
            this.game.physics.arcade.enable(this);
            this.scale.set(0.62);
            this.ship = ship;
        }

        

    }
}