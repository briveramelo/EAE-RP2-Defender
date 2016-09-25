module Jelicopter.Client {

    export class GamepadManager extends Phaser.Sprite {

        joystick: Phaser.SinglePad;
        level: MainGame;
        game: Phaser.Game;
        shootWasJustPressed: boolean;
        joyStickIsActive: boolean;
        switchWasJustPressed: boolean;

        constructor(game: Phaser.Game, level: MainGame) {
            super(game, 0,0, 'EnemyBullet');
            this.level = level;
            this.game = game;
            game.input.gamepad.start();
            // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
            this.joystick = game.input.gamepad.pad1;
            this.joystick.deadZone = 0.1;
            //game.input.onDown.add(this.dump, this);
            game.add.existing(this);
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.joyStickIsActive = false;
        }

        update() {
            this.toggleInputDevice();

            if (this.joyStickIsActive) {
                if (this.level.playerShip.alive) {

                    var xAxis: number = this.joystick.axis(Phaser.Gamepad.AXIS_0);
                    var yAxis: number = this.joystick.axis(Phaser.Gamepad.AXIS_1);

                    this.move(xAxis, yAxis);
                    this.animate(xAxis);
                    this.handleFiring();
                    
                }
            }
        }

        animate(xAxis:number) {
            
            var isMoving: boolean = Math.abs(xAxis)>0;

            if (isMoving) {
                if (this.level.playerShip.animations.frame == 0) {
                    this.level.playerShip.stretchAnim.play();
                }
                if (this.level.playerShip.wasJustFacingRight != this.level.playerShip.isGoingRight) {
                    this.level.playerShip.contractAnim.play();
                }
            }
            else {
                if (this.level.playerShip.animations.frame == this.level.playerShip.maxVelocityFrame) {
                    this.level.playerShip.contractAnim.play();
                }
            }

            this.level.playerShip.wasJustFacingRight = this.level.playerShip.isGoingRight;

        }

        handleFiring() {
            var isPressed = this.joystick.isDown(Phaser.Gamepad.BUTTON_0);
            if (isPressed && !this.shootWasJustPressed) {
                if (this.level.tractorBeam.isCarryingPerson) {
                    this.level.tractorBeam.flingPerson();
                }
                else {
                    this.level.playerShip.fireBullet();
                }
            }
            this.shootWasJustPressed = isPressed;
        }

        toggleInputDevice() {
            var switchIsPressed: boolean = this.game.input.keyboard.isDown(Phaser.KeyCode.S);
            if (switchIsPressed && !this.switchWasJustPressed) {
                this.joyStickIsActive = !this.joyStickIsActive;
            }
            this.switchWasJustPressed = switchIsPressed;
        }

        move(xAxis:number, yAxis:number) {
            
            var ySpeed = yAxis * this.level.playerShip.shipSpeed.y;

            this.level.playerShip.body.velocity.y = 0;

            var isGoingRight: boolean = this.level.playerShip.scale.x === 1;
            var baseXSpeed: number = (isGoingRight ? 1 : -1) * (this.level.playerShip.baseSpeed);
            var joystickXSpeed: number = xAxis * this.level.playerShip.shipSpeed.x;
            var xSpeed: number = baseXSpeed + joystickXSpeed;

            this.level.playerShip.body.velocity.x = xSpeed;

            if (xAxis || yAxis) {

                if (xAxis < 0) {
                    if (isGoingRight) {
                        this.level.playerShip.scale.x = -1;
                    }
                }
                else if (xAxis > 0) {
                    if (!isGoingRight) {
                        this.level.playerShip.scale.x = 1;
                    }
                }

                if (yAxis) {
                    if ((this.level.playerShip.position.y < this.level.playerShip.maxHeight && yAxis > 0) ||
                        (this.level.playerShip.position.y > this.level.playerShip.minHeight && yAxis < 0)) {
                        this.level.playerShip.body.velocity.y = ySpeed;
                    }                    
                }
            }            
        }        
    }
}