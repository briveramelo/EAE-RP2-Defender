module Jelicopter.Client {

    export class Level01 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Ship;
        bullets: Bullet;
        people: People;
        score: number = 0;
        scoreText;
        isSaving = false;
        savePersonIndex;

        create() {
            
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.background = this.add.sprite(0, 0, 'GameBackground');
            this.bullets = new Bullet(this.game);
            this.player = new Ship(this.game, this.world.centerX, this.world.centerX, this.bullets);
            this.player.anchor.setTo(0, 5);
            this.people = new People(this.game,this.player);
            //this.game.debug.text("Use Right and Left arrow keys to move the bat", 0, this.world.height, "red");
            this.displayScore();

        }

        update() {
            for (var i = 0, len = this.people.children.length; i < len; i++) {
                if (this.checkOverlap(this.player, this.people.children[i])) {
                    //this.people.children[i].worldPosition = this.player.world;
                    this.savePersonIndex = i;
                    this.score += 10;
                    this.scoreText.text = 'Score: ' + this.score;
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

            //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
           // this.scoreText.setTextBounds(0, 100, 800, 100);
        }

    }

}