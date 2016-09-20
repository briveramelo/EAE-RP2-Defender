module Jelicopter.Client {

    export class Level01 extends Phaser.State {

        backgrounds: Phaser.Group;
        music: Phaser.Sound;
        ufos: Phaser.Group;
        ufoSpawner: UFOSpawner;
        enemyBullets: Phaser.Group;

        bullets: Bullet;
        player: Ship;
        people: People;
        hospital: Hospital;
<<<<<<< HEAD

        screenWidth : number= 5760;

        allObjects;

        isSaving: boolean = false;
        savePersonIndex: number;
        score: number = 0;
        scoreText;

        create() {            
            this.game.world.setBounds(0, 0, 10000000000, 1080);
            this.physics.startSystem(Phaser.Physics.ARCADE);                        
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;

            //CREATE OBJECTS
            this.createBackgrounds();
            this.createBuildings();
            this.createPlayerShip();
            this.createPeople();
            this.createEnemyBullets();
            this.createUFOs();

            //this.game.camera.bounds = null;
            this.game.camera.follow(this.player);
            this.displayScore();

            this.addAllObjectsToList();
        }

        addAllObjectsToList() {
            this.allObjects = [];
            var i :number= 0;
            this.enemyBullets.forEach(function (bullet) {
                this.allObjects[i] = bullet;
                i++;
            }, this);
            this.ufos.forEach(function (ufo) {
                this.allObjects[i] = ufo;
                i++;
            }, this);
            //this.backgrounds.forEach(function (background) {
            //    this.allObjects[i] = background;
            //    i++;
            //}, this);
        }

        createBackgrounds() {
            this.backgrounds = this.add.group();
            this.backgrounds.createMultiple(3, 'GameBackground');
            var i: number = 0;
            this.backgrounds.forEach(function (background) {
                background.position.x = this.game.world.centerX - this.screenWidth + i * this.screenWidth;
                background.revive();
                i++;                
            }, this);
            this.backgrounds.setAll('anchor.x', 0.5);
        }

        createPeople() {
            this.people = new People(this.game, this.player);
        }

        createBuildings() {
            this.hospital = new Hospital(this.game, this.game.world.centerX, 550);
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

            if (this.player.alive) {
                this.wrapAroundTheWorld(this.player, this.screenWidth);
                this.doPlayerOverlapPhysics();
                this.checkToCollectPeople();
            }           

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)) {
                this.pause();
            }

        }

        pause() {
            this.game.paused = !this.game.paused;
        }

        wrapAroundTheWorld(player, screenWidth) {            
            var i: number = 0;
            this.allObjects.forEach(function (object) {
                if (object.alive) {
                    var dist = Math.abs(object.position.x - player.position.x);
                    //if (i == 0) {
                    //    console.log(screenWidth / 2);
                    //}
                    if (Math.abs(object.position.x - player.position.x) > (screenWidth / 2)) {
                        console.log(object);
                        var shiftRightWard: boolean = player.body.velocity.x > 0;
                        object.position.x += (shiftRightWard ? 1 : -1) * screenWidth;
                    }
                }
                //i++;
            });


            this.backgrounds.forEach(function (background) {                
                if (Math.abs(background.position.x - player.position.x) > (screenWidth * 2)) {
                    var shiftRightWard: boolean = player.body.velocity.x > 0;
                    background.position.x += (shiftRightWard ? 1:-1) * screenWidth * 3;
                }
            }, this);


            //this.game.world.wrap(this.player, 0/*-(this.game.width / 2)*/, false, true, false);
            //this.enemyBullets.forEachAlive(function (bullet) {
            //    this.game.world.wrap(bullet, 0/*-(this.game.width / 2)*/, false, true, false);
            //}, this);
            //this.ufos.forEachAlive(function (ufo) {
            //    this.game.world.wrap(ufo, 0/*-(this.game.width / 2)*/, false, true, false);
            //}, this);
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

        checkToCollectPeople() {
            for (var i = 0, len = this.people.children.length; i < len; i++) {
                if (this.checkOverlap(this.player, this.people.children[i])) {
                    //this.people.children[i].worldPosition = this.player.world;
                    this.savePersonIndex = i;

                    this.isSaving = true;
                }
                else {

                }
            }


            if (this.isSaving) {
                //this.people.children[this.savePersonIndex].position = this.player.position;
                this.people.forEach(function (item) {
                    if (this.player.scale.x === 1) {
                        item.body.x = this.player.body.x + 32;
                        item.body.y = this.player.body.y;
                    }
                    else {
                        item.body.x = this.player.body.x - 32;
                        item.body.y = this.player.body.y;
                    }
                }, this);
                //this.isSaving = false;
            }
            if (this.checkOverlap(this.player, this.hospital)) {
                if (this.isSaving) {
                    this.isSaving = false;
                    this.score += 10;
                    this.scoreText.text = 'Score: ' + this.score;
                    this.people.children[this.savePersonIndex].x = this.people.originalXPosition;
                    this.people.children[this.savePersonIndex].y = this.people.originalYPosition;
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

=======

        isSaving: boolean = false;
        savePersonIndex: number;
        score: number = 0;
        scoreText;

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
            this.hospital = new Hospital(this.game, 700, 550);
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
        }

        checkToCollectPeople() {
            for (var i = 0, len = this.people.children.length; i < len; i++) {
                if (this.checkOverlap(this.player, this.people.children[i])) {
                    //this.people.children[i].worldPosition = this.player.world;
                    this.savePersonIndex = i;

                    this.isSaving = true;
                }
                else {

                }
            }


            if (this.isSaving) {
                //this.people.children[this.savePersonIndex].position = this.player.position;
                this.people.forEach(function (item) {
                    if (this.player.scale.x === 1) {
                        item.body.x = this.player.body.x + 32;
                        item.body.y = this.player.body.y;
                    }
                    else {
                        item.body.x = this.player.body.x - 32;
                        item.body.y = this.player.body.y;
                    }
                }, this);
                //this.isSaving = false;
            }
            if (this.checkOverlap(this.player, this.hospital)) {
                if (this.isSaving) {
                    this.isSaving = false;
                    this.score += 10;
                    this.scoreText.text = 'Score: ' + this.score;
                    this.people.children[this.savePersonIndex].x = this.people.originalXPosition;
                    this.people.children[this.savePersonIndex].y = this.people.originalYPosition;
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

>>>>>>> a184aa52405de3e626019924c1f0583494593d8d
            //  The Text is positioned at 0, 100
            this.scoreText = this.game.add.text(0, 0, "Score: 0", style);
            this.scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

            //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
            // this.scoreText.setTextBounds(0, 100, 800, 100);
        }

    }

}