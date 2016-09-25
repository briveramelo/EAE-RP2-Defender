module Jelicopter.Client {

    export class Maps extends Phaser.Group {
        map_back;
        map_mid;
        map_frame;
        player_sprite;
        map_center;
        miniMapContainer;
        constructor(game: Phaser.Game, level: MainGame) {
            super(game);
            this.map_frame = this.game.add.sprite(500, 45, 'MapCityFrame');
            this.map_back = this.game.add.sprite(500, 40, 'MapCityMid');
            this.map_mid = this.game.add.sprite(500, 40, 'MapCityBack');
            this.player_sprite = this.game.add.sprite(500, 40, 'Bullet');
            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.add(this.map_frame);
            this.add(this.map_mid);
            this.add(this.map_back);
            this.add(this.player_sprite);
            this.setAll('anchor.x', 0.5);
            this.setAll('anchor.y', 0.5);
            this.fixedToCamera = true;

            //this.createMiniMap();

        }

        updatePositionOfPlayerInMap(velocity) {
            //var a = position.x / 5000000000;
            this.player_sprite.body.velocity.x = velocity.x;
            //var p = a - 1;
            //a = a - 1;
            //position.x = position.x % 500000;
            console.debug(velocity.x);
            //this.player_sprite.position.x += a; 
            //this.player_sprite.position.y = position.y - 300;
            //this.player_sprite.position.x = position.x - 300;
        }
    }

    //    createMiniMap() {
    //        this.miniMapContainer = this.game.add.group();
    //        resolution = 2 / gameSize;
    //        if (game.world.width > 8000)
    //        { var renderWH = 8000; }
    //        else { var renderWH = game.world.width; }
    //        renderTexture = game.add.renderTexture(renderWH, renderWH);
    //        renderTexture.resolution = resolution;
    //        var cropRect = new Phaser.Rectangle(0, 0, 200, 200);
    //        renderTexture.crop = cropRect;
    //        var miniMapY = game.camera.view.height - (game.world.height * resolution);
    //        var miniMapUI = game.add.image(0, 0, 'mini_map');
    //        renderTexture.trueWidth = renderTexture.resolution * game.world.width;
    //        renderTexture.trueHeight = renderTexture.resolution * game.world.height;
    //        var cropRect = new Phaser.Rectangle(0, 0, renderTexture.trueWidth, renderTexture.trueHeight);
    //        renderTexture.crop = cropRect; var miniWidth = .075 * renderTexture.trueWidth;
    //        var miniHeight = miniMapY - (.06 * renderTexture.trueHeight);
    //        miniMap = game.add.sprite(miniWidth, miniHeight, renderTexture);
    //        var padding = .241 * renderTexture.trueHeight; miniMapUI.width = (renderTexture.trueWidth + padding);
    //        miniMapUI.height = (renderTexture.trueHeight + padding);
    //        miniMapUI.y = game.camera.view.height - miniMapUI.height;
    //        miniMapUI.fixedToCamera = true;
    //        miniMap.fixedToCamera = true;
    //        viewRect = game.add.graphics(0, 0);
    //        viewRect.lineStyle(1, 0xFFFFFF);
    //        viewRect.drawRect(miniMap.x, miniMap.y, game.camera.view.width * resolution, game.camera.view.height * resolution);
    //        unitDots = game.add.graphics(miniMap.x, miniMap.y);
    //        unitDots.fixedToCamera = true;
    //        var bg = game.add.graphics(0, 0);
    //        bg.beginFill(0x000000, 1);
    //        bg.drawRect(0, miniMapUI.y + (miniMapUI.height * .1), miniMapUI.width * .95, miniMapUI.height * .9);
    //        bg.fixedToCamera = true;
    //        var children = [bg, miniMap, unitDots, viewRect, miniMapUI]; miniMapContainer.addMultiple(children);
    //    } 
        
    //    function updateUnitDots() {
    //    unitDots.clear(); gameObjects.forEach(function (object) {
    //        var unitMiniX = object.x * renderTexture.resolution;
    //        var unitMiniY = object.y * renderTexture.resolution;
    //        var objectType = object.objectType; if (objectType == 'unit' || objectType == 'building' || objectType == 'wall') {
    //            if (playerColors[object.player - 2] == undefined) {                // player 1                var color = '0x1331a1';            } else {                var color = playerColors[object.player - 2].color;            }            unitDots.beginFill(color);            if (objectType == 'building') {                unitDots.drawRect(unitMiniX, unitMiniY, 5, 5);            } else {                unitDots.drawEllipse(unitMiniX, unitMiniY, 1.5, 1.5);            }        } else if (objectType == 'plant') { // tree            unitDots.beginFill(0x2A4B17);            unitDots.drawEllipse(unitMiniX, unitMiniY, 2, 2);        } else {            var color = '0x666666'; // gray            unitDots.beginFill(color);            unitDots.drawRect(unitMiniX, unitMiniY, 5, 5);        }    });}
    //}
}