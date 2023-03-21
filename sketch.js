var PLAY = 1;
var END = 0;
var gameState = PLAY;

var girl_running
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var Boulder;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  
  girl_running = loadAnimation("Girl running.png")
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  Boulder = loadImage("Boulder.png")
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  girl = createSprite(50,height-70,20,50);
  
  
  girl.addAnimation("running", girl_running);
  girl.setCollider('circle',0,0,350)
  girl.scale = 0.08;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 

  cloudsGroup = new Group();
  
  score = 0;
}

function draw() {
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && girl.y  >= height-120) {
      jumpSound.play( )
      girl.velocityY = -10;
       touches = [];
    }
    
    girl.velocityY = girl.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    girl.collide(invisibleGround);
    spawnClouds();
    spawnBoulders();
  
    if(spawnBoulders.isTouching(girl)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    girl.velocityY = 0;
    Boulders.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    

    
    //set lifetime of the game objects so that they are never destroyed
    Boulders.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = girl.depth;
    girl.depth = girl.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function Boulders() {
  if(frameCount % 60 === 0) {
    var boulder = createSprite(600,height-95,20,30);
    boulder.setCollider('circle',0,0,45)
   
  
    boulder.velocityX = -(6 + 3*score/100);
    
   
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: boulder.addImage(boulder);
              break;
      case 2: boulder.addImage(boulder);
              break;
      default: break;
    }
             
    boulder.scale = 0.3;
    boulder.lifetime = 300;
    boulder.depth = girl.depth;
    girl.depth +=1;
    
    boulder.add(boulder);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  boulder.destroyEach();
  cloudsGroup.destroyEach();
  
  girl.changeAnimation("running",girl_running);
  
  score = 0;
  
}
