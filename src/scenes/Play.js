class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/harpoon.png');
        this.load.image('spaceship', './assets/sharknew.png');
        this.load.image('starfield', './assets/seabed.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/shark_go_boom2.png', {frameWidth: 96, frameHeight: 64, startFrame: 0, endFrame: 11});
    }
    

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
       // this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x000000).setOrigin(0, 0);
        //this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0); 
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding -27, 'rocket').setOrigin(-0.4,0);
        this.p2Rocket = new Rocket(this, game.config.width/2 + 60, game.config.height - borderUISize - borderPadding -27, 'rocket').setOrigin(-0.4, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);  
        // define keys
        this.p1Rocket.firebutton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        //keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        //keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.p1Rocket.moveleft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.p1Rocket.moveright = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        this.p2Rocket.firebutton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.p2Rocket.moveleft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.p2Rocket.moveright = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        this.timernew = game.settings.gameTimer;
              // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '22px',
            //backgroundColor: '#F3B141',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '22px',
            //backgroundColor: '#F3B141',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 120
        }
        this.scoreLeft = this.add.text(borderUISize+ borderPadding + 50 , borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.add.text(borderUISize, borderUISize + borderPadding*2, 'p1 score:', textConfig);

        this.scoreRight = this.add.text(borderUISize + borderPadding +480, borderUISize + borderPadding*2, this.p2Score, scoreConfig);
        this.add.text(borderUISize + borderPadding +400, borderUISize + borderPadding*2, 'p2 score:', textConfig);

        this.TimerMid = this.add.text(borderUISize + borderPadding +200, borderUISize + borderPadding*2 -20, this.timernew, scoreConfig);
         
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            //this.timernew +=1;
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        
    }
    update() {
        console.log(this.p1Rocket.height);
          // check key input for restart
        if (this.gameOver) {

            if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.p1Rocket.moveleft)) {
                this.scene.start("menuScene");
            }
            if (Phaser.Input.Keyboard.JustDown(keyR)){
              this.scene.restart();
            }
        }
        this.starfield.tilePositionX -= 4;
        if ( !this.gameOver){
            this.timernew = this.clock.getOverallRemainingSeconds();
            this.p1Rocket.update();
            this.p2Rocket.update();
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.TimerMid.text = Math.floor(this.timernew);
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03,1);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode( this.ship02,1);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01,1);
        }

        if(this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship03,2);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode( this.ship02,2);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship01,2);
        }
    }


    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship, x) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });   
          // score add and repaint
        if (x == 1){
            this.p1Score += ship.points;
        }

        if (x == 2){
            this.p2Score += ship.points;
        }
        this.scoreLeft.text = this.p2Score;   
        this.scoreRight.text = this.p1Score;
        this.sound.play('sfx_explosion');   
    }
}