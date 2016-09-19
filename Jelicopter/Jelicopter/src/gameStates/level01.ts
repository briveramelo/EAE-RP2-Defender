module Jelicopter.Client {

    export class Level01 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        ufos: Phaser.Group;
        enemyBullets: Phaser.Group;
        player: Ship;
        ufoSpawner: UFOSpawner;

        create() {            
            this.game.world.setBounds(0, 0, 5760, 1080);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.background = this.add.sprite(0, 0, 'GameBackground');
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            //CREATE OBJECTS
            this.createEnemyBullets();
            this.createUFOs();
            this.createPlayerShip();
            this.game.camera.follow(this.player);
            this.game.camera.bounds = null;
            
        }

        createUFOs() {
            var i: number = 0;
            this.ufos = this.game.add.group();
            for (i = 0; i < 30; i++){
                this.ufos.add( new UFO(this.game, this, -1000, -1000));
            }
            this.ufoSpawner = new UFOSpawner(this.game, this);
        }

        createEnemyBullets() {
            this.enemyBullets = this.game.add.group();
            this.enemyBullets.enableBody = true;
            this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.enemyBullets.createMultiple(50, 'EnemyBullet');
            this.enemyBullets.forEach(function (bullet) {
                bullet.myCollider = new CircleCollider(bullet, 4, new Phaser.Point(0, 0));
            }, this);

            this.enemyBullets.setAll('checkWorldBounds', true);
            this.enemyBullets.setAll('outOfBoundsKill', true);                        
        }

        createPlayerShip() {
            this.player = new Ship(this.game, this, this.world.centerX, this.world.centerY);    
        }

        update() {
            //this.physics.arcade.overlap(this.enemyBullets, this.player, this.player.kill, null, this);

            if (this.player.alive) {
                this.wrapAroundTheWorld();
            }
            if (this.player.alive) {
                this.doPlayerOverlapPhysics();
            }
        }

        wrapAroundTheWorld() {
            this.game.world.wrap(this.player, -(this.game.width / 2), false, true, false);
            this.enemyBullets.forEachAlive(function (bullet) {
                this.game.world.wrap(bullet, 0/*-(this.game.width / 2)*/, false, true, false);
            }, this);
            this.ufos.forEachAlive(function (ufo) {
                this.game.world.wrap(ufo, 0/*-(this.game.width / 2)*/, false, true, false);
            }, this);
        }

        doPlayerOverlapPhysics() {
            //player and bullets
            this.enemyBullets.forEachAlive(function (bullet) {
                if (this.player.myCollider.isColliding(bullet.myCollider)) {
                    this.player.kill();
                    bullet.kill();
                }
            }, this);

            this.ufos.forEachAlive(function (ufo: UFO) {
                if (this.player.myCollider.isColliding(ufo.myCollider)) {
                    this.player.kill();
                    ufo.kill();
                }
            }, this);
        }

    }

}