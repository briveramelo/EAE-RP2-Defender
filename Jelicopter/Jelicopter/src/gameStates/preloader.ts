module Jelicopter.Client {

    export class Preloader extends Phaser.State {

        loaderText: Phaser.Text;

        preload() {
            this.game.antialias = false;
            this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...",
                { font: "18px Arial", fill: "#A9A91111", align: "center" });
            this.loaderText.anchor.setTo(0.5);

            //TitleScreenery
            this.load.image('titlepage', './assets/ui/titlePage.png');
            this.load.image('logo', './assets/ui/Jelicopter.png');

            //Audio
            this.load.audio('Aliens', './assets/sounds/BackgroundTunes/Aliens.mp3', true);

            this.load.audio('personDeath', './assets/sounds/SoundFX/Explosion5.wav', true);
            this.load.audio('fireShot', './assets/sounds/SoundFX/Hit_Hurt2.wav', true);
            this.load.audio('abduct', './assets/sounds/SoundFX/Abduction.wav', true);
            this.load.audio('heliExplode', './assets/sounds/SoundFX/Explosion8.wav', true);

            //Backgrounds
            this.load.image('GameBackground', './assets/sprites/Background/background.jpg');
            this.load.image('CityBack', './assets/sprites/Background/City-Back.png');
            this.load.image('CityMid', './assets/sprites/Background/City-Mid.png');
            this.load.image('Foreground', './assets/sprites/Background/Foreground.png');

            //Bullets
            this.load.image('EnemyBullet', './assets/sprites/Shots/EnemyBullet.png');
            this.load.image('Bullet', './assets/sprites/Shots/bullet02.png');
            this.load.image('PlayerBullet', './assets/sprites/Shots/Shot_2.png');
            this.load.image('UFOBullet', './assets/sprites/Shots/Shot_3.png');
            this.load.image('Missile', './assets/sprites/Shots/Bomb.png');
            

            ///VISUAL FX
            //LASER
            this.game.load.spritesheet('laser', 'assets/sprites/VisualFX/laser.png', 32, 32);

            
            //Blue UFO Explosion
            this.load.spritesheet('blue_fire', './assets/sprites/VisualFX/blue_sprite.png', 115, 104);
            this.load.spritesheet('ship_smoke', './assets/sprites/VisualFX/smoke_sprite.png', 115, 104);
            //Body Explosion
            this.load.spritesheet('Male1_Parts', 'assets/sprites/VisualFX/male1_parts_sprite.png', 124, 124);
            this.load.spritesheet('Male2_Parts', 'assets/sprites/VisualFX/male2_parts_sprite.png', 124, 124);
            this.load.spritesheet('Female1_Parts', 'assets/sprites/VisualFX/female1_parts_sprite.png', 124, 124);
            this.load.spritesheet('Female2_Parts', 'assets/sprites/VisualFX/female2_parts_sprite.png', 124, 124);
            this.load.image('blood', 'assets/sprites/VisualFX/blood_drop.png');
            this.load.spritesheet('guts', 'assets/sprites/VisualFX/guts_sprite.png', 64, 64);
            //Ship Trail
            this.load.spritesheet('player-ship-trail', 'assets/sprites/VisualFX/ship-trail_2.png', 32, 32);
            //this.load.spritesheet('ship_death', 'assets/ship_death_sprite.png', 115, 115);
            //this.load.spritesheet('ship_smoke', 'assets/smoke_sprite.png', 115, 104);
            //BuildingExplosion
            //
            //SCORE
            this.load.spritesheet('score_feedback', './assets/sprites/VisualFX/score_sprite.png', 90, 90);

            //Ships
            this.load.image('invisibleDot', 'assets/sprites/Ship/invisibleDot.png');
            this.load.atlasJSONHash('Heli', './assets/sprites/Ship/Heli.png', './assets/sprites/Ship/Heli.json');
            this.load.atlasJSONHash('PlayerShip', './assets/sprites/Ship/PlayerShip.png', './assets/sprites/Ship/PlayerShip.json');
            this.load.spritesheet('heli_death_sprite', './assets/sprites/VisualFX/heli_death_sprite.png',115, 115);

            //People
            this.load.atlasJSONHash('Male1', './assets/sprites/People/Male1.png', './assets/sprites/People/Male1.json');
            this.load.atlasJSONHash('Male2', './assets/sprites/People/Male2.png', './assets/sprites/People/Male2.json');
            this.load.atlasJSONHash('Female1', './assets/sprites/People/Female1.png', './assets/sprites/People/Female1.json');
            this.load.atlasJSONHash('Female2', './assets/sprites/People/Female2.png', './assets/sprites/People/Female2.json');
            this.load.spritesheet('Bob', './assets/sprites/People/bob.png', 128, 128);
            this.load.image('Parachute', './assets/sprites/People/parachute.png');

            // Hospital
            //this.load.atlasJSONHash('Hospital', './assets/sprites/Buildings/safe_place.png', './assets/sprites/Buildings/safe_place.json');

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
            this.game.state.start('MainGame', true, false);
        }

    }

}