// hero class
function Hero(game, x, y, id) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);

    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.id = id;
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
     if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};

Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation
    // jumping
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

// Spider class
function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('crawl', [0, 1, 2], 8, true); // 8fps, looped
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 100;

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};

Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};


// game states
PlayState = {};

PlayState.init = function () {

    // Add array with populations
    this.populations = [];
    // Create the first population
    this.population = new population(0);
    this.population.createFirstPopulation();
    this.populations[0] = this.population;

    this.DNA = [];
    for(let i = 0; i < this.population.size; i++){
        this.DNA[i] = this.population.getMember(i).getDNA();
    }

    this.game.renderer.renderSession.roundPixels = true;

    // Index to check amount of coins
    this.coinPickupCount = 0;
    // Index to set the time for changing command
    this.runIndex = 0;
    // Index to change the commands
    this.commandIndex = 0;
    // Index to change the hero
    this.heroIndex = 0;
    // Index to control the current population
    this.populationIndex = 0;

    this.stop = false;

    this.popNrText;
    this.style = { font: "bold 16px Arial", fill: "#000000", boundsAlignH: "center", boundsAlignV: "middle" };

    this.yled = 0;
};

PlayState.preload = function () {
    this.game.load.json('level:1', 'data/levelTest.json');

    this.game.load.image('font:numbers', 'images/numbers.png');

    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.image('invisible-ground', 'images/invisible_ground.png');
    this.game.load.image('icon:coin', 'images/coin_icon.png');

    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
    this.game.load.spritesheet('door', 'images/door.png', 42, 66);

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');

    this.game.load.image('startbutton','images/start.png');
    this.game.load.image('stopbutton', 'images/stop.png')
};

PlayState.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        door: this.game.add.audio('sfx:door')
    };

    // create level
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON('level:1'));

    // crete hud with scoreboards
    this._createHud();
    this.createGUI();
    this.game.stage.backgroundColor = '#ffffff';


};

PlayState.update = function () {
    this._handleCollisions();
    //console.log('X:' + this.input.activePointer.x);
    //console.log('Y:' + this.input.activePointer.y);

    this.runIndex++;
    if(this.runIndex === 25) {
        // Check if all the commands have run for all heroes
        if(!this.stop) {
            this._runPopulation(this.populations[this.populationIndex]);
        }else{
            this.heroes.forEach(function(c){c.move(0)})
        }
    }
    this.coinFont.text = `x${this.coinPickupCount}`;
};

PlayState._runPopulation = function (currentPopulation) {
    if(this.commandIndex !== currentPopulation.members[0].DNASize) {
        this._handleInput();
        this.commandIndex++;
        this.runIndex = 0;

    } else {
        // If all commands are done, make heroes stop and calculate fitness score
        for(let i = 0; i < this.population.size; i++){
            this.heroes.children[i].move(0);
            //currentPopulation.members[i].setFitnessScore(this._calculateDistance(this.heroes.children[i].position, this.door.position));
        }
        this._createNewGeneration();
        this.populationIndex++;
        this.runIndex = 0;
        this.commandIndex = 0;
    }

};

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.heroes, this.platforms);

    this.game.physics.arcade.overlap(this.heroes, this.coins, this._onHeroVsCoin, null, this);
    this.game.physics.arcade.overlap(this.heroes, this.spiders, this._onHeroVsEnemy, null, this);
    this.game.physics.arcade.overlap(this.heroes, this.door, this._onHeroVsDoor, null, this);
    this.game.physics.arcade.overlap(this.heroes, this.invisibleGrounds, this._invisibleGroundVsHero, null, this)
};

PlayState._handleInput = function () {

    for(let i = 0; i < this.populations[this.populationIndex].size; i++) {
        let DNACommand = this.populations[this.populationIndex].getMember(i).DNA[this.commandIndex];
        if(!this.populations[this.populationIndex].getMember(i).win) {
            if (DNACommand === "WR") {
                //console.log("go right");
                this.heroes.children[this.heroIndex].move(1);
            }
            else if (DNACommand === "WL") {
                //console.log("go left");
                this.heroes.children[this.heroIndex].move(-1);
            }
            else if (DNACommand === "J") {
                //console.log("jump");
                this.heroes.children[this.heroIndex].jump();
            }
            else if (DNACommand === "JR") {
                //console.log("jump right");
                this.heroes.children[this.heroIndex].move(1);
                this.heroes.children[this.heroIndex].jump();
            }
            else if (DNACommand === "JL") {
                //console.log("jump left");
                this.heroes.children[this.heroIndex].move(-1);
                this.heroes.children[this.heroIndex].jump();
            }
        }else {
            this.heroes.children[this.heroIndex].move(0);
        }
        let currentDistance = this._calculateDistance(this.door.position, this.heroes.children[this.heroIndex].position);
        let currentDistanceY = this._calculateDistanceY(this.door.position, this.heroes.children[this.heroIndex].position);

        if(currentDistance < this.populations[this.populationIndex].getMember(i).minDistance) {
            this.populations[this.populationIndex].getMember(i).setMinDistance(currentDistance);
        }

        if(currentDistanceY < this.populations[this.populationIndex].getMember(i).minDistanceY) {
            this.populations[this.populationIndex].getMember(i).setMinDistanceY(currentDistanceY);
        }
        // Go to the next hero and make one command for each and then reset index
        this.heroIndex++;
        if(this.heroIndex === this.population.size) {
            this.heroIndex = 0;
        }
    }
};

PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.heroes = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    this.invisibleGrounds = this.add.group();

    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
    // spawn hero and enemies
    this._spawnCharacters({heroes: data.heroes, spiders: data.spiders});
    // spawn important objects
    data.coins.forEach(this._spawnCoin, this);

    this._spawnDoor(data.door.x, data.door.y);

    this._spawnInvisibleGround(0,420,8, 2); // 1
    this._spawnInvisibleGround(420,336,4, 4); // 2
    this._spawnInvisibleGround(672,378,8, 2); // 3
    this._spawnInvisibleGround(126,252,4, 8); // 4
    this._spawnInvisibleGround(462,168,6, 16); // 5
    this._spawnInvisibleGround(798,84,2 , 32); // 6

    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnInvisibleGround= function (x,y, size, platformScore) {
    let sprite = this.invisibleGrounds.create(x + 9, y - 5, 'invisible-ground');
    this.game.physics.enable(sprite);
    sprite.scale.x = size - 0.5;
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
    sprite.platformScore = platformScore;
};
PlayState._spawnCharacters = function (data) {
    // spawn spiders
    /*data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);*/

    this._spawnHeroes();
};

PlayState._spawnHeroes = function () {
    let x = 21;
    let y = 525;
    for(let i = 0; i < this.population.size; i++){
        let sprite = new Hero(this.game, x, y, i);
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        sprite.events.onInputDown.add(this.clickedHero, {hero: sprite, this:this} );
        this.heroes.add(sprite);
        this.heroes.id = i;
    }
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};

PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();
    this.coinPickupCount++;
};

PlayState._onHeroVsEnemy = function (hero, enemy) {
	// kill enemies when hero is falling
    if (hero.body.velocity.y > 0) { 
        hero.bounce();
        enemy.die();
        this.sfx.stomp.play();
    }
    else {
    	// game over -> restart the game
        this.sfx.stomp.play();
        hero.kill();
        //this.game.state.restart();
    }
};

PlayState._invisibleGroundVsHero = function (hero, ground) {
    if(ground.platformScore > this.populations[this.populationIndex].members[hero.id].platformScore){
        this.populations[this.populationIndex].members[hero.id].platformScore = ground.platformScore;
        this.populations[this.populationIndex].members[hero.id].platformCommandIndex = this.commandIndex;

        console.log("During runtime " + this.populations[this.populationIndex].members[hero.id].platformScore);
    }
};

PlayState._onHeroVsDoor = function (hero, door) {
    this.sfx.door.play();
    //this.game.state.restart();
    this.populations[this.populationIndex].getMember(door.id).setWin();
    // TODO: go to the next level instead
};

PlayState._createHud = function () {
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR);

    let coinIcon = this.game.make.image(0, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width, coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.add(coinScoreImg);
    this.hud.position.set(10, 10);
};

PlayState._spawnDoor = function (x, y) {
	x = 850; // Hardcoded because changes in json did not work
	y = 90;
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};

PlayState._calculateDistance = function(pos1, pos2){
    return  Math.sqrt(Math.pow((pos2.x-pos1.x), 2) + Math.pow((pos2.y-pos1.y), 2));
};

PlayState._calculateDistanceY = function(pos1, pos2){
    return pos2.y - pos1.y;
};

PlayState.clickedHero = function () {
    console.log(this.this.populations[this.this.populationIndex]);
   // console.log(this.populations[this.populationIndex]);

    //console.log(this.populations[this.populationIndex].members[this.hero.id].DNA);
    this.this.game.add.text(600, 750, "DNA " + this.this.populations[this.this.populationIndex].members[this.hero.id].DNA, this.this.style);

};

PlayState._createNewGeneration = function () {
    this.populations[this.populationIndex].mapFitnessScoreMembers();
    this.newPopulation = new population(this.populationIndex + 1);
    this.populations[this.populationIndex + 1] = this.newPopulation;
    this.newPopulation.createPopulation(this.populations[this.populationIndex].members);

    this.popNrText.setText("Population nr: " + this.populations[this.populationIndex +1].generationNr);

    this.game.add.text(200, 650 + this.yled, "Best in population nr " + this.populations[this.populationIndex].generationNr + ": " + this.populations[this.populationIndex].members[39].totaltFitnessScore.toFixed(2), this.style);
    this.yled += 30;

    // Reset the heroes position
    for(let i = 0; i < this.newPopulation.size; i++) {
        this.DNA[i] = this.newPopulation.members[i].getDNA();
        this.heroes.children[i].kill();
        this.heroes.children[i].reset(21, 525);
    }

    console.log(this.populations);
    // Reset the coins
    for(let i = 0; i < this.coins.children.length; i ++){
        this.coins.children[i].kill();
        this.coins.children[i].reset(this.coins.children[i].x, this.coins.children[i].y);
    }
    // TODO hack for spawning enemies
    /*this.spiders.forEachAlive(function(c){c.kill()});
    for(let i = 0; i < 3; i++){
        let sprite = new Spider(this.game, this.spiders.children[i].x, this.spiders.children[i].y);
        this.spiders.add(sprite);
    }*/
};

PlayState.startGame = function(){
    console.log("startknapp");
    this.stop = false;
};

PlayState.stopGame = function(){
    console.log("stopknapp");
    this.stop = true;
};



PlayState.createGUI = function() {
    this.game.add.button(20, 650, 'startbutton', this.startGame, this);
    this.game.add.button(20, 700, 'stopbutton', this.stopGame, this);
    
    this.popNrText = this.game.add.text(30, 770, "Population nr: " + this.populations[this.populationIndex].generationNr, this.style);
    this.game.add.text(600, 650, "Click on hero to get DNA", this.style);

};

// entry point
window.onload = function () {
    let game = new Phaser.Game(960, 1500, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');

};


