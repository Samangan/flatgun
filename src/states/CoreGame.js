import _ from 'underscore';

// TODO:
// * Make each level a pre-determined color.
// * Having a level would be fun. (A simple 2d death match arena so players can hide behind walls and pillars and such)


class CoreGame extends Phaser.State {
    preload () {
        this.game.load.image('bullet', 'assets/sprites/bullet01.png');
    }

    // TODO:
    // * Put some dummy opponent shapes here.
    // * Make the opponents blow up when we shoot at them.
    // * We gain a level when we kill someone.

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.n = 4;
        this.center = {x: 300, y: 300};
        this.player = this.createPolygon(this.center, this.n);


        // Init some enemies:
        this.enemies = [];

        for (var i = 0; i < 10; i++) {
            var c = {x: 100 * i + 50, y: 50};
            this.enemies.push(this.createPolygon(c, i + 3));
        }

        // Init some test bullets and a test weapon (This will eventually be specific to each level)
        this.weapon = this.game.add.weapon(30, 'bullet');
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletAngleOffset = 90;
        this.weapon.bulletSpeed = 400;
        this.weapon.fireRate = 60;
        this.weapon.bulletAngleVariance = 10;
        //this.weapon.trackSprite(this.player.polygon, 1, 1);


        // TODO:
        // * The easiest way to get what I want is with a big spritesheet with the transitions and I animate over
        //   to the next level.
        // * * This will give me the smooth animations as well as give me the power of the physics of the sprites.

    }

    update() {
        this.listenForUserInput();
    }

    render() {
    }

    listenForUserInput() {
        var speed = 4;

        // TODO: Make left and right rotate the shape and up and down accelerate and decelerate.
        // LIke this: https://phaser.io/examples/v2/arcade-physics/angular-velocity

        // TODO: A lot of this acceleration stuff comes for free if you are a sprite. Could I make a sprite out of
        // my polygon coordinates?
        // * Brainstorming:
        // * * Maybe I could put an invisible 1 px X 1px sprite at the center of the polygon and then as that sprite moves
        //     I also update the center position and re-draw the polygon.... I guess I could just have the polygon be a sprte itself instead of actually drawing it mathematically each time.

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.center.x -= speed;
            this.player.graphics.destroy();
            this.player = this.createPolygon(this.center, this.n);
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.center.x += speed;
            this.player.graphics.destroy();
            this.player = this.createPolygon(this.center, this.n);
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.center.y -= speed;
            this.player.graphics.destroy();
            this.player = this.createPolygon(this.center, this.n);
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.center.y += speed;
            this.player.graphics.destroy();
            this.player = this.createPolygon(this.center, this.n);
        }

        if (this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).isDown)
        {
            this.weapon.fireFrom.x = this.center.x;
            this.weapon.fireFrom.y = this.center.y;
            this.weapon.fire();
        }
    }

    movePolygon(deltaX, deltaY) {
        for (var i = 0; i < this.testShape.points.length; i++) {
            this.testShape.points[i].x += deltaX;
            this.testShape.points[i].y += deltaY;
        }
    }

    createPolygon(center, n) {
        var radius = 30;
        var vertices = this.generateNGon({x: center.x, y: center.y}, radius, n);
        var p = new Phaser.Polygon(vertices);

        // TODO: Try only drawing the outside lines to see if that gives a better look.
        var g = this.game.add.graphics(0, 0);
        g.beginFill(0x42f4bf);
        g.drawPolygon(p);
        g.endFill();

        return {
            polygon: p,
            graphics: g
        };
    }

    generateNGon(center, radius, numSides) {
        var thetaDelta = (2 * Math.PI)/numSides;
        var theta = thetaDelta;
        var points = [];

        for (var n = 0; n < numSides; n++) {
            var x = center.x + radius * Math.cos(theta);
            var y = center.y - radius * Math.sin(theta);
            points.push({x: x, y: y});

            theta += thetaDelta;
        }
        return points;
    }

}


export default CoreGame;
