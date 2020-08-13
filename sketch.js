var trex,trex_running,obstacle,cactus1,cactus2,cactus3,cactus4,cactus5,cactus6,ground,inviground,score,trex_dead,ground_image,gameState,cloud,cloud_image,score,obstacleGroup,cloudGroup;
var jump,dead,checkpoint;

localStorage["highScore"] = 0;

var gameover,txt_gameover,restart,restart_button;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  
  txt_gameover = loadImage("gameOver.png");
  restart_button = loadImage("restart.png");
  
  trex_dead = loadImage("trex_collided.png");
  
  jump = loadSound("jump.mp3");
  dead = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  gamestate = "play";
  
  trex = createSprite(60,140,10,10);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_dead)
  trex.scale = 0.6;
  
  ground = createSprite(300,160,canvas.width,20);
  ground.addAnimation("infinite",ground_image);
  
  inviground = createSprite(200,180,canvas.width,20);
  inviground.visible = false;
  
  score = 0;
  
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
  gameover = createSprite(300,80,10,10)
  gameover.addImage("gameover",txt_gameover);
  gameover.scale = 0.75;
  gameover.visible = false;
  
  restart = createSprite(300,120,10,10)
  restart.addImage("restart",restart_button);
  restart.scale = 0.55;
  restart.visible = false;
  
}

function draw() {
  background(245);
  
  text("highscore = "+ localStorage["highScore"],400,30);
  
  if(gamestate === "play"){
    
    if(score % 100 === 0 && score > 1){
      checkpoint.play();
    }
    
    if(keyDown("space") && trex.y > 130){
     trex.velocityY = -15;
     jump.play();
    }
    trex.velocityY = trex.velocityY + 0.9;
     
    ground.velocityX = -(6+Math.round(score/200));
    
    if(ground.x <= 0){
      ground.x = ground.width/2;
    }
    
   if(trex.isTouching(obstacleGroup)){
    gamestate = "end";
   }
  
    score = score+Math.round(getFrameRate()/60.5);
    
    drawclouds();
    drawobstacles();
  }
    
  if(gamestate === "end"){
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    ground.velocityX = 0;
    
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_dead);
    
    restart.visible = true;
    gameover.visible = true;
    
    dead = loadSound("die.mp3");
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
    


  text("score = "+ score,500,30);
  
  trex.collide(inviground);
  
  drawSprites();
}


function drawclouds(){
  if(frameCount % 80 === 0 || frameCount === 1){
    var randomY = Math.round(random(50,90));
    
    cloud = createSprite(600,randomY,10,10);
    cloud.addImage("cloud",cloud_image);
    cloud.velocityX = -2;
    cloud.scale = 0.5;
    cloud.lifetime = 302;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;  
    
    cloudGroup.add(cloud);
  }
}

function drawobstacles(){
  if(frameCount % 70 === 0 || frameCount === 1){
    var randomAni = Math.round(random(1,6));
    
    obstacle = createSprite(600,145,10,10);
    
    switch(randomAni){
      case 1: obstacle.addImage(cactus1);
        break;
      case 2: obstacle.addImage(cactus2);
        break;
      case 3: obstacle.addImage(cactus3);
        break;
      case 4: obstacle.addImage(cactus4);
        break;
      case 5: obstacle.addImage(cactus5);
        break;
      case 6: obstacle.addImage(cactus6);
        break;
      default:
        break;
    }
    
    
    obstacle.velocityX = -(6+Math.round(score/200));
    obstacle.scale = 0.5;
    obstacle.lifetime = 110;
    
    obstacleGroup.add(obstacle);
  }
}

function reset(){
  gamestate = "play";
  
  restart.visible = false;
  gameover.visible = false;
  
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  if(localStorage["highScore"] < score) {
    localStorage["highScore"] = score;
  }
  
  score = 0;
}
