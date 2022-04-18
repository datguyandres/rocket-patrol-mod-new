let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);
// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

/* simultaneous two-player mode added
redesigned the game's artwork, sound and UI and changed the theme and aesthetic to
shark hunting instead of shotting spaceships
lastly added a timer which should then make a grand total of 100 points :)
the project took me about 10 ish hours to complete entirely.

Andres Benitez, SHARK FISHING, 4/18/2022*/
