module Jelicopter.Client {

    export class TractorBeam extends Phaser.Sprite {

        game: Phaser.Game;
        level: MainGame;
        people: Phaser.Group;
        positionOffset: Phaser.Point = new Phaser.Point(102, 50);
        clipPositions: Phaser.Point[];
        isFullyLoaded: boolean = false;
        peopleBeingCarried: Person[];
        paratrooperBeingCarried: ParaTrooper;
        myCollider: CircleCollider;
        maxClipSize: number = 5;
        isWaitingToEmitPulse: boolean;
        baseLaunch: number = 100;
        maxLaunch: number = 800;

        constructor(game: Phaser.Game, level: MainGame, people: Phaser.Group) {
            super(game, 0, 0, 'invisibleDot');
            this.game = game;
            this.level = level;
            this.people = people;
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.myCollider = new CircleCollider(this, 40, new Phaser.Point(0, 0));
            this.peopleBeingCarried = [];
            this.clipPositions = [];
            for (var i: number = 0; i < this.maxClipSize; i++) {
                this.peopleBeingCarried[i] = null;
                this.clipPositions[i] = new Phaser.Point(0, i * 30);
            }
            
        }

        update() {
            if (this.level.playerShip.alive) {
                this.setPosition();
                this.carryDropPeople();
                if (!this.isFullyLoaded) {
                    this.checkToCollectPeople();
                    if (!this.isWaitingToEmitPulse) {
                        this.emitPulse();
                    }
                }
            }
        }

        emitPulse() {
            this.isWaitingToEmitPulse = true;
            var vel: Phaser.Point = new Phaser.Point(this.level.playerShip.baseSpeed * (this.level.playerShip.isGoingRight ? 1 : -1), this.level.playerShip.body.velocity.y);
            var pointOfOrigin: Phaser.Point = new Phaser.Point(this.position.x, this.position.y - 50);
            this.level.tractorBeamParticleManager.pulseEmitter(pointOfOrigin, vel);
            this.game.time.events.add(100, this.allowEmittingPulses, this);
        }

        allowEmittingPulses() {
            this.isWaitingToEmitPulse = false;
        }

        setPosition() {
            this.position.x = this.level.playerShip.position.x + (this.level.playerShip.scale.x === this.level.playerShip.scaleMult ? 1 : -1) * this.positionOffset.x;
            this.position.y = this.level.playerShip.position.y + this.positionOffset.y;
        }

        checkToCollectPeople() {
            var i: number = 0;
            this.people.forEach(function (person: Person) {
                if (person.alive && !person.isPausedForFlinging && !person.isBeingHeld) {
                    if (person.myCollider.isColliding(this.myCollider)) {
                        this.collectPerson(person);
                    }
                }
                i++;
            }, this);

            //////////////////
            //AJAY, LETS GET PARATROOPERS IN THIS SAME LIST OF PEOPLE
            //////////////////

            //i = 0;
            //this.level.paratroopers.forEach(function (paratrooper: ParaTrooper) {
            //    if (paratrooper.alive && !paratrooper.isPausedForFlinging && !this.isCarryingPerson) {
            //        if (paratrooper.myCollider.isColliding(this.myCollider)) {
            //            this.collectParaTrooper(paratrooper);
            //        }
            //    }
            //    i++;
            //}, this);
        }

        carryDropPeople() {            
            var i: number = 0;
            for (var i: number = 0; i < this.maxClipSize; i++) {
                if (this.peopleBeingCarried[i] != null) {
                    if (this.peopleBeingCarried[i].alive) {
                        this.carryPerson(i);
                    }
                    else {
                        this.dropPerson(i);
                    }
                }
            }
        }

        carryPerson(personIndex: number) {

            if (personIndex == 0) {
                this.peopleBeingCarried[0].rotate();
            }            
            this.peopleBeingCarried[personIndex].position.x = this.position.x + this.clipPositions[personIndex].x * (this.level.playerShip.isGoingRight ? 1 : -1);
            this.peopleBeingCarried[personIndex].position.y = this.position.y + this.clipPositions[personIndex].y;
        }        

        dropPerson(personIndex: number) {
            this.isFullyLoaded = false;
            this.peopleBeingCarried[personIndex] = null;
            for (var i: number = 1; i < this.maxClipSize; i++){
                if (this.peopleBeingCarried[i] != null) {
                    this.peopleBeingCarried[i - 1] = this.peopleBeingCarried[i];
                    this.peopleBeingCarried[i] = null;
                }
            }

            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        //dropParaTrooper() {
        //    this.isFullyLoaded = false;
        //    this.paratrooperBeingCarried = null;
        //    this.level.soundManager.playSound(SoundFX.Abduct);
        //}
        
        flingPerson() {
            var isGoingRightMult: number = this.level.playerShip.isGoingRight ? 1 : -1;
            var xLaunch: number = (this.baseLaunch * isGoingRightMult) + this.level.playerShip.body.velocity.x;
            if (Math.abs(xLaunch) > this.maxLaunch) {
                xLaunch = this.maxLaunch * isGoingRightMult;
            }
            var launchVelocity: Phaser.Point = new Phaser.Point(xLaunch, this.level.playerShip.body.velocity.y);
            this.peopleBeingCarried[0].getFlung(launchVelocity);
            this.dropPerson(0);
        }

        //flingParatrooper() {
        //    var launchVelocity: Phaser.Point = new Phaser.Point(this.level.playerShip.body.velocity.x, this.level.playerShip.body.velocity.y);
        //    this.paratrooperBeingCarried.getFlung(launchVelocity);
        //    this.dropParaTrooper();
        //}

        collectPerson(person: Person) {            
            var clipIndex = 0;
            for (var i: number = 0; i < this.maxClipSize; i++){
                if (this.peopleBeingCarried[i] == null) {
                    clipIndex = i;
                    break;
                }
            }

            if (clipIndex != 0) {
                person.angle = 90;
            }

            this.peopleBeingCarried[clipIndex] = person;
            if (clipIndex == this.maxClipSize) {
                this.isFullyLoaded = true;
            }

            person.getGrabbed();

            this.level.soundManager.playSound(SoundFX.Abduct);
        }

        //collectParaTrooper(paratrooper: ParaTrooper) {
        //    paratrooper.removeChild(paratrooper.parachute);
        //    this.paratrooperBeingCarried = paratrooper;
        //    this.isFullyLoaded = true;
        //    paratrooper.getGrabbed();
        //    this.level.soundManager.playSound(SoundFX.Abduct);
        //}

        isOverlapping(spriteA, spriteB) {
            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();
            return Phaser.Rectangle.intersects(boundsA, boundsB);
        }

    }
}