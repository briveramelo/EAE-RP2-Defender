module Jelicopter.Client {

    export class Level01 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        ufos: Phaser.Group;
        ufoSpawner: UFOSpawner;
        enemyBullets: Phaser.Group;

        bullets: Bullet;
        player: Ship;
        people: People;
        hospital: Hospital;

        isSaving: boolean = false;
        savePersonIndex: number;
        score: number = 0;
        scoreText;

        create() {            
            this.game.world.setBounds(0, 250, 5760, 500);
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.background = this.add.sprite(0, 0, 'GameBackground');
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            //CREATE OBJECTS
            this.createEnemyBullets();
            this.createUFOs();
            this.createPlayerShip();
            this.createPeople();
            this.createBuildings();

            //this.game.camera.bounds = null;
            this.game.camera.follow(this.player);
            this.displayScore();
            
        }

        createPeople() {
            this.people = new People(this.game, this.player);
        }

        createBuildings() {
            this.hospital = new Hospital(this.game, 700, 1200);
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
            this.bullets = new Bullet(this.game);
            this.player = new Ship(this.game, this, this.world.centerX, this.world.centerY, this.bullets);    
        }

        update() {
            //this.physics.arcade.overlap(this.enemyBullets, this.player, this.player.kill, null, this);
            if (this.people.length===0) {
                this.game.state.start('GameOver', true, false);
            }
            if (this.player.alive) {
                this.wrapAroundTheWorld();
                this.doPlayerOverlapPhysics();
                this.checkToCollectPeople();
            }           

        }

        wrapAroundTheWorld() {
            this.game.world.wrap(this.player, 0/*-(this.game.width / 2)*/, false, true, false);
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

            if (this.player.lives === 0) {
                this.game.state.start('GameOver', true, false);
            }
        }

        checkToCollectPeople() {
            for (var i = 0, len = this.people.children.length; i < len; i++) {
                if (this.checkOverlap(this.player, this.people.children[i])) {
                    //this.people.children[i].worldPosition = this.player.world;
                    this.savePersonIndex = i;
                    this.isSaving = true;
                }               
            }


            if (this.isSaving) {
                var i = 0;
                
                //this.people.children[this.savePersonIndex].position = this.player.position;
                this.people.forEach(function (item) {
                    if (i == this.savePersonIndex) { 
                    if (this.player.scale.x === 1) {
                        item.body.x = this.player.body.x + 32;
                        item.body.y = this.player.body.y;
                    }
                    else {
                        item.body.x = this.player.body.x - 32;
                        item.body.y = this.player.body.y;
                        }
                    }
                    i++;
                }, this);
                //this.isSaving = false;
            }
            if (this.checkOverlap(this.player, this.hospital)) {
                if (this.isSaving) {
                    this.isSaving = false;
                    this.score += 10;
                    this.scoreText.text = 'Score: ' + this.score;
                    var i = 0;
                    this.people.forEach(function (item) {
                        if (i == this.savePersonIndex) {
                            //item.body.x = 40000;
                            //item.body.y = 40000;
                            item.kill();
                            item.destroy();
                            console.debug(this.people.length);
                            //break;
                        }
                        i++;
                    },this);

                    //this.people.children[this.savePersonIndex].x = this.people.originalXPosition;
                    //this.people.children[this.savePersonIndex].y = this.people.originalYPosition;
                    //this.people.forEach(function (item) {
                    //    item.body.x = this.building.body.x;
                    //    item.body.y = this.building.body.y;
                    //}
                }
            }
            
        }

        checkOverlap(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);

        }

        displayScore() {
            var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

            //  The Text is positioned at 0, 100
            this.scoreText = this.game.add.text(0, 0, "Score: 0", style);
            this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            this.scoreText.fixedToCamera = true;
            //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
            // this.scoreText.setTextBounds(0, 100, 800, 100);
        }

    }

}