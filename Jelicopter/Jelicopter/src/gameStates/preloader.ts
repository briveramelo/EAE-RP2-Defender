﻿module Jelicopter.Client {
    export class Preloader extends Phaser.State {
        loaderText: Phaser.Text;
        preload() {
            
            this.game.antialias = false;
            this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...",
                { font: "18px PixelFont", fill: "#ffffff", align: "center" });
            this.loaderText.anchor.setTo(0.5);
            this.loadAudio();
            this.loadImages();
            this.loadVisualFX();
        }
        loadAudio() {
            //MUSIC
            this.load.audio('Aliens', './assets/sounds/BackgroundTunes/Aliens.ogg', true);
            //COLLISIONS
            this.load.audio('heliExplode', './assets/sounds/SoundFX/Collision/Explosion8.ogg', true);
            this.load.audio('personDeath', './assets/sounds/SoundFX/Collision/PersonDeathExplosion.ogg', true);
            this.load.audio('shieldHit', './assets/sounds/SoundFX/Collision/shield_hit.ogg', true);
            //SHOTS
            this.load.audio('fireShot', './assets/sounds/SoundFX/Shots/laser_fire.ogg', true);
            this.load.audio('fireRocket', './assets/sounds/SoundFX/Shots/RocketShotPart1.ogg', true);
            //TRACTOR BEAM
            this.load.audio('abduct', './assets/sounds/SoundFX/TractorBeam/Abduction.ogg', true);
            //END GAME
            this.load.audio('gameOver', './assets/sounds/SoundFX/death_game_over.ogg', true);
        }
        loadImages() {
            //TitleScreenery
            this.load.image('TitleScreen', './assets/ui/TitleScreen.jpg');
            this.load.image('logo', './assets/ui/offender-logo.png');
            //Backgrounds
            this.load.image('GameBackground', './assets/sprites/Background/background.jpg');
            this.load.image('CityBack', './assets/sprites/Background/City-Back.png');
            this.load.image('CityMid', './assets/sprites/Background/City-Mid.png');
            this.load.image('Foreground', './assets/sprites/Background/Foreground.png');
            this.load.image('GameOver', './assets/sprites/Background/GameOver_Screen.jpg');
            this.load.image('Credits', './assets/sprites/Background/credits.jpg');
            //Bullets
            this.load.atlasJSONHash('EnemyBullet', './assets/sprites/Shots/bullet.png', './assets/sprites/Shots/bullet.json');
            //Ships
            this.load.image('invisibleDot', 'assets/sprites/Ship/invisibleDot.png');
            this.load.atlasJSONHash('Heli', './assets/sprites/Ship/Heli.png', './assets/sprites/Ship/Heli.json');
            this.load.atlasJSONHash('PlayerShip', './assets/sprites/Ship/PlayerShip.png', './assets/sprites/Ship/PlayerShip.json');
            this.load.atlasJSONHash('ship-shield', './assets/sprites/Ship/ship_shield.png', './assets/sprites/Ship/ship_shield.json');
            this.load.atlasJSONHash('ship-shield-outer', './assets/sprites/Ship/ship_shield_outer.png', './assets/sprites/Ship/ship_shield_outer.json');
            this.load.atlasJSONHash('ship-shield-hit', 'assets/sprites/VisualFX/shield_hit.png', 'assets/sprites/VisualFX/shield_hit.json');
            this.load.spritesheet('health-bar', 'assets/sprites/Ship/health-bar.png', 80, 64);
            //People
            this.load.atlasJSONHash('Male1', './assets/sprites/People/Male1.png', './assets/sprites/People/Male1.json');
            this.load.atlasJSONHash('Male2', './assets/sprites/People/Male2.png', './assets/sprites/People/Male2.json');
            this.load.atlasJSONHash('Female1', './assets/sprites/People/Female1.png', './assets/sprites/People/Female1.json');
            this.load.atlasJSONHash('Female2', './assets/sprites/People/Female2.png', './assets/sprites/People/Female2.json');
            this.load.spritesheet('Bob', './assets/sprites/People/bob.png', 128, 128);
            this.load.image('Parachute', './assets/sprites/People/parachute.png');
            //Vehicle
            this.load.spritesheet('heli_death_sprite', './assets/sprites/VisualFX/heli_death_sprite.png', 115, 115);
            this.load.atlasJSONHash('Tank', './assets/sprites/Vehicles/Tank.png', './assets/sprites/Vehicles/Tank.json');

            
        }
        loadVisualFX() {
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
            this.load.spritesheet('Bob_Parts', './assets/sprites/VisualFX/Bob-parts.png', 128, 128);
            this.load.image('blood', 'assets/sprites/VisualFX/blood_drop.png');
            this.load.spritesheet('guts', 'assets/sprites/VisualFX/guts_sprite.png', 64, 64);
            //SHIP 
            this.load.spritesheet('player-ship-trail', 'assets/sprites/VisualFX/ship-trail_2.png', 32, 32);
            this.load.spritesheet('ship_parts', 'assets/sprites/VisualFX/player_ship_parts_sprite.png', 124, 124);
            this.load.image('hit-indicator', 'assets/sprites/VisualFX/hit_indicator.png');
            //TRACTOR BEAM PULSE
            this.load.atlasJSONHash('abduction_beam', 'assets/sprites/VisualFX/abduction_beam.png', 'assets/sprites/VisualFX/abduction_beam.json');
            //SCORE
            this.load.spritesheet('score_feedback', './assets/sprites/VisualFX/score_sprite.png', 90, 90);
            //Tanks
            this.load.spritesheet('tank_burst', './assets/sprites/VisualFX/tank_parts_sprite.png', 62, 62);
        }

        create() {
            this.startMainMenu();
        }
        startMainMenu() {
            this.game.state.start('MainMenu', true, false);
        }
        startLevel() {
            this.game.state.start('MainGame', true, false);
        }
    }
}