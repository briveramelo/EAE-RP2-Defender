﻿module Jelicopter.Client {

    export class Preloader extends Phaser.State {

        loaderText: Phaser.Text;

        preload() {
            this.game.antialias = false;
            this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...",
                { font: "18px Arial", fill: "#A9A91111", align: "center" });
            this.loaderText.anchor.setTo(0.5);

            this.load.image('titlepage', './assets/ui/titlePage.png');
            this.load.image('logo', './assets/ui/Jelicopter.png');
            this.load.audio('click', './assets/sounds/click.ogg', true);

            this.load.image('GameBackground', './assets/sprites/Background/GameBackground-pixel.jpg');
            this.load.image('EnemyBullet', './assets/sprites/UFO/EnemyBullet.png');
            this.load.image('Bullet', './assets/sprites/Ship/bullet02.png');
            this.load.image('Hospital', './assets/sprites/Buildings/building.png');

            //this.load.spritesheet('ship_death', 'assets/ship_death_sprite.png', 115, 115);
            //this.load.spritesheet('ship_fire', 'assets/fire_sprite.png', 115, 104);
            //this.load.spritesheet('ship_smoke', 'assets/smoke_sprite.png', 115, 104);

            this.load.atlasJSONHash('JumpingMale', './assets/sprites/People/Jumping_male.png', './assets/sprites/People/Jumping_male.json');
            this.load.atlasJSONHash('Ship', './assets/sprites/Ship/Ship_1.png', './assets/sprites/Ship/Ship_1.json');
            this.load.atlasJSONHash('UFO', './assets/sprites/UFO/UFO_1.png', './assets/sprites/UFO/UFO_1.json');

        }

        create() {
            //var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 2000,
            //    Phaser.Easing.Linear.None, true);
            //tween.onComplete.add(this.startMainMenu, this);
            this.startLevel();
        }

        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }

        startLevel() {
            this.game.state.start('Level01', true, false);
        }

    }

}