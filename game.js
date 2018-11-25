
const app = new PIXI.Application({width:window.innerWidth, height:window.innerHeight});

//add the canvas to the html document
document.body.appendChild(app.view);

app.renderer.autoResize = true;
app.view.style.position = "absolute";
app.view.style.display = "block";

app.renderer.resize(window.innerWidth,window.innerHeight);

window.addEventListener('resize',() => {
    app.renderer.view.style.width = window.innerWidth + "px";
    app.renderer.view.style.height = window.innerHeight + "px";
    app.renderer.resize(window.innerWidth,window.innerHeight);
});

let state,bgFar, bgMid,clouds,groundTiles,animatedCat, animation, frames;

//load and create sprite
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
    //set the background
    let backgroundContainer = new PIXI.Container();

    let background = new PIXI.Sprite(PIXI.loader.resources["images/background.png"].texture);
    background.scale.set(0.5);

    //set far background
    let bgFarTexture = PIXI.Texture.from("images/bg-far.png");
    bgFar = new PIXI.extras.TilingSprite(bgFarTexture,app.screen.width,app.screen.height);
    bgFar.tileScale.set(0.3);
    bgFar.tilePosition.x = 0;
    //bgFar.tilePosition.y = app.screen.height - bgFarTexture.height;

    //set middle background
    let bgMidTexture = PIXI.Texture.from("images/bg-mid.png");
    bgMid = new PIXI.extras.TilingSprite(bgMidTexture,app.screen.width,app.screen.height);
    bgMid.tileScale.set(0.3);
    bgMid.tilePosition.x = 0;
    //bgMid.tilePosition.y = app.screen.height - bgMidTexture.height;

    //set clouds background
    let cloudsTexture = PIXI.Texture.from("images/clouds.png");
    clouds = new PIXI.extras.TilingSprite(cloudsTexture,app.screen.width,app.screen.height/2);
    clouds.tileScale.set(0.3);
    clouds.tilePosition.x = 0;
    //clouds.tilePosition.y = app.screen.height - cloudsTexture.height;

    //add ground tiles
    let tilesSpriteSheet = PIXI.loader.resources["images/pink-pack/pink-tiles-sprites.json"].textures;

    groundTiles = new PIXI.extras.TilingSprite(tilesSpriteSheet["1.png"],app.screen.width,tilesSpriteSheet["1.png"].height/2);
    groundTiles.y = app.renderer.height - groundTiles.height;
    groundTiles.tilePosition.x =0;
    groundTiles.tileScale.set(0.5);

    backgroundContainer.addChild(background,bgFar,bgMid,clouds, groundTiles);

    app.stage.addChild(backgroundContainer);

    //set the cat sprite and animate it

    console.log(frames);
    animatedCat = new PIXI.extras.AnimatedSprite(getFrames("Idle",10));
    console.log(animatedCat);
    animatedCat.scale.set(0.3);
    animatedCat.position.set(100,app.screen.height- groundTiles.height - animatedCat.height+7);
    animatedCat.vx = 0;
    animatedCat.animationSpeed = 0.2;
    animatedCat.play();



    //add event listeners for keyboard controls
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);


    app.stage.addChild(animatedCat);
    //Set the game state
    state = play;

    //Start the game loop
    app.ticker.add(delta => gameLoop(delta));

}
function gameLoop(delta) {
    state(delta);
    app.renderer.render(app.stage);
}


function play() {
    bgFar.tilePosition.x -= 0.80;
    bgMid.tilePosition.x -= 0.64;
    clouds.tilePosition.x -= 0.128;
    groundTiles.tilePosition.x -= 1;
    animatedCat.x += animatedCat.vx;



}

function getFrames(frameType,frameLimit){
    let frames = [];
    for(let i = 1; i <= frameLimit; i++) {
        frames.push(PIXI.Texture.fromFrame(frameType + '(' + i + ').png'));
    }
    return frames;
}

//function for keydown event
function onKeyDown(key) {
    if(key.code === "ArrowDown") {
        /*player.accelerationY = player.speed;
        player.frictionY = 1;*/
    } else if(key.code === "ArrowUp"){
        /*player.accelerationY = -player.speed;
        player.frictionY = 1;*/
    } else if(key.code === "ArrowRight"){
        animatedCat.textures = getFrames("Run", 8);
        animatedCat.vx = 2;

        animatedCat.play();

        //player.frictionX = 1;
    } else if(key.code === "ArrowLeft"){
       /* player.accelerationX = -player.speed;
        player.frictionX = 1;*/
    }
    return key.code;
}

//function for keyup event
function onKeyUp(key) {
    //animatedCat.loop = false;
    if(key.code === "ArrowDown" && onKeyDown !== "ArrowUp") {
        player.accelerationY = 0;
        player.frictionY = player.drag;
    } else if(key.code === "ArrowUp" && onKeyDown !== "ArrowDown"){
        player.accelerationY = 0;
        player.frictionY = player.drag;
    } else if(key.code === "ArrowRight" && onKeyDown !== "ArrowLeft"){
        animatedCat.textures = getFrames("Idle", 8);
        animatedCat.vx = 0;
        animatedCat.play();
    } else if(key.code === "ArrowLeft" && onKeyDown !== "ArrowRight"){
        player.accelerationX = 0;
        player.frictionX = player.drag;
    }
}
