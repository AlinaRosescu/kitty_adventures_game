(function() {
const app = new PIXI.Application({
                width:window.innerWidth,
                height:window.innerHeight,
                autoResize: true,
                resolution: window.devicePixelRatio,
            });

// add the canvas to the html document
document.body.appendChild(app.view);

// add event listener on window resize
window.addEventListener('resize', resize);

let backgroundContainer,state,bgFar,bgMid,clouds,groundTiles,animatedCat;

// load and create sprite
PIXI.loader
    .add([
        "images/background.png",
        "images/bg-far.png",
        "images/bg-mid.png",
        "images/clouds.png",
        "images/pink-pack/pink-tiles-sprites.json",
        "images/cat/cat-sprites.json"
    ])
    .load(setup);


function setup() {
    // set the background
    backgroundContainer = new PIXI.Container();

    let background = new PIXI.Sprite(PIXI.loader.resources["images/background.png"].texture);
    app.stage.addChild(background);

    // set far background
    let bgFarTexture = PIXI.Texture.from("images/bg-far.png");
    bgFar = new PIXI.extras.TilingSprite(bgFarTexture,window.innerWidth,window.innerHeight);
    bgFar.tilePosition.x = 0;

    // set middle background
    let bgMidTexture = PIXI.Texture.from("images/bg-mid.png");
    bgMid = new PIXI.extras.TilingSprite(bgMidTexture,app.screen.width,app.screen.height);
    bgMid.tilePosition.x = 0;

    // set clouds background
    let cloudsTexture = PIXI.Texture.from("images/clouds.png");
    clouds = new PIXI.extras.TilingSprite(cloudsTexture,app.screen.width,app.screen.height/2);
    clouds.tilePosition.x = 0;

    backgroundContainer.addChild(bgFar,bgMid,clouds);
    app.stage.addChild(backgroundContainer);

    // add ground tiles
    let tilesSpriteSheet = PIXI.loader.resources["images/pink-pack/pink-tiles-sprites.json"].textures;
    groundTiles = new PIXI.extras.TilingSprite(tilesSpriteSheet["1.png"],window.innerWidth,tilesSpriteSheet["1.png"].height/2);
    groundTiles.tilePosition.x =0;
    app.stage.addChild(groundTiles);

    // set the cat sprite and animate it
    animatedCat = new PIXI.extras.AnimatedSprite(getFrames("Idle",10));
    animatedCat.vx = 0;
    animatedCat.animationSpeed = 0.2;
    animatedCat.play();

    app.stage.addChild(animatedCat);

    // add event listeners for keyboard controls
    // document.addEventListener("keydown", onKeyDown);
    // document.addEventListener("keyup", onKeyUp);

    var keyboard = new Keyboard();
    keyboard.add({
        key: 'ArrowRight',
        down: function () {
            animatedCat.textures = getFrames("Run", 8);
            animatedCat.vx = 2;
        },
        up: function () {
            animatedCat.textures = getFrames("Idle", 10);
            animatedCat.vx = 0;
        }
    });
    keyboard.install(document);

    resize();

    // set the game state
    state = play;

    // start the game loop
    app.ticker.add(delta => gameLoop(delta));

}
function gameLoop(delta) {
    state(delta);
    app.renderer.render(app.stage);
}


function play() {
    bgFar.tilePosition.x -= 0.64;
    bgMid.tilePosition.x -= 0.80;
    clouds.tilePosition.x -= 0.128;
    groundTiles.tilePosition.x -= 1;
    animatedCat.x += animatedCat.vx;
    animatedCat.play();


}

function resize() {
    // get window size
    let width = window.innerWidth;
    let height = window.innerHeight;

    // resize pixi renderer
    app.renderer.resize(width, height);

    for (let i = 0; i < backgroundContainer.children.length; i++) {
        let tilingSprite = backgroundContainer.children[i];

        // change tiling sprites sizes
        tilingSprite.width = width;
        tilingSprite.height = height;

        // and scale it based on window height
        let scale = height / tilingSprite.texture.height;
        tilingSprite.tileScale.set(scale);
    }

    // change ground tiles width and height
    groundTiles.width = width;
    groundTiles.height = height *0.1;
    groundTiles.y = app.screen.height - groundTiles.height;
    groundTiles.tileScale.set((height * 0.1) / (groundTiles.texture.height));

    // change animated cat scale and position
    animatedCat.scale.set((height * 0.2) / (animatedCat.texture.height));
    animatedCat.position.set(100,window.innerHeight - animatedCat.height - groundTiles.height);

}

function getFrames(frameType,frameLimit){
    let frames = [];
    for(let i = 1; i <= frameLimit; i++) {
        frames.push(PIXI.Texture.fromFrame(frameType + '(' + i + ').png'));
    }
    return frames;
}

// var isKeyPressed = {};
//
// //function for keydown event
// function onKeyDown(key) {
//     if (isKeyPressed[key.code]) {
//         return;
//     }
//     isKeyPressed[key.code] = true;
//
//     console.log(key);
//     if(key.code === "ArrowDown") {
//         /*player.accelerationY = player.speed;
//         player.frictionY = 1;*/
//     } else if(key.code === "ArrowUp"){
//         /*player.accelerationY = -player.speed;
//         player.frictionY = 1;*/
//     } else if(key.code === "ArrowRight"){
//         animatedCat.textures = getFrames("Run", 8);
//         animatedCat.vx = 2;
//
//         //animatedCat.play();
//
//         //player.frictionX = 1;
//     } else if(key.code === "ArrowLeft"){
//        /* player.accelerationX = -player.speed;
//         player.frictionX = 1;*/
//     }
//     return key.code;
// }

//function for keyup event
// function onKeyUp(key) {
//     if (!isKeyPressed[key.code]) {
//         return;
//     }
//     isKeyPressed[key.code] = false;
//     //animatedCat.loop = false;
//     if(key.code === "ArrowDown") {
//         player.accelerationY = 0;
//         player.frictionY = player.drag;
//     } else if(key.code === "ArrowUp"){
//         player.accelerationY = 0;
//         player.frictionY = player.drag;
//     } else if(key.code === "ArrowRight"){
//         animatedCat.textures = getFrames("Idle", 8);
//         animatedCat.vx = 0;
//     } else if(key.code === "ArrowLeft"){
//         player.accelerationX = 0;
//         player.frictionX = player.drag;
//     }
// }

})();