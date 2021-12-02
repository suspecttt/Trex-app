var trex, trex_correndo;
var solo, solo_imagem;
var solo_inv;
var Nuvem_img
var Cacto1_img, Cacto2_img, Cacto3_img, Cacto4_img, Cacto5_img, Cacto6_img;
var Nuvem_group;
var Cacto_group;
var JOGAR = 1;
var ENCERRAR = 0;
var EstadoJogo = JOGAR;
var Fonte;
var Score = 0;
var trex_parado;
var fim_do_jogo;
var Fim_do_jogo;
var Reiniciar;
var reiniciar;
var checkPoint;
var pulo;
var morte;
var HI = 0

function preload(){
  
  Nuvem_img = loadImage("nuvem.png")
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_parado = loadAnimation("trex_parado.png");
  solo_imagem = loadImage("solo2.png");
  Cacto1_img = loadImage("obstaculo1.png");
  Cacto2_img = loadImage("obstaculo2.png");
  Cacto3_img = loadImage("obstaculo3.png");
  Cacto4_img = loadImage("obstaculo4.png");
  Cacto5_img = loadImage("obstaculo5.png");
  Cacto6_img = loadImage("obstaculo6.png");
  Fonte = loadFont("Fonte.ttf");
  fim_do_jogo = loadImage("fimDoJogo.png");
  reiniciar = loadImage("reiniciar.png");
  checkPoint = loadSound("checkPoint.mp3");
  pulo = loadSound("pulo.mp3");
  morte = loadSound("morte.mp3");
  
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //cria trex
  trex = createSprite(50,height-100,20,50);
  trex.addAnimation("correndo", trex_correndo);
  trex.addAnimation("parado", trex_parado);
  trex.scale = 0.5;
  
  solo = createSprite(width/2,height-30,1200,5);
  solo.addImage(solo_imagem);
  
  solo_inv = createSprite(300,height-20,1200,5);
  solo_inv.visible = false;
  
  Reiniciar = createSprite(width/2,height/2+20);
  Reiniciar.addImage(reiniciar);
  
  Fim_do_jogo = createSprite(width/2,height/2-10);
  Fim_do_jogo.addImage(fim_do_jogo);
  
  Reiniciar.visible = false
  Fim_do_jogo.visible = false
  
  trex.debug = false
  
  trex.setCollider("circle",0,0,43)
  
  Nuvem_group = new Group();
  Cacto_group = new Group();
  
  Fim_do_jogo.scale = 0.5
  Reiniciar.scale = 0.5
}

function draw(){
  background("white");
  
  drawSprites();
  
  trex.collide(solo_inv);
  
  textFont(Fonte);
  text("SCORE: "+ Score,width-150,20);
  
  if(HI > 0 ){
  textFont(Fonte);
  text("HI: "+HI,width-250,20)
  }
  
  if (EstadoJogo === JOGAR){
    
    //gravidade
    trex.velocityY = trex.velocityY + 1.9;
    
    //pulo
    if (keyDown("space") && trex.y > height-47||touches.length > 0 && trex.y > height-47){
      trex.velocityY = -20;
      pulo.play()
      touches = [];
    }
    
    solo.velocityX = -(6+Score*3/100);
    
    //se o X do solo sair da tela ele volta pro meio da tela
    if (solo.x < 0){
      solo.x = solo.width/2
    }
    
    Score = Math.round(Score + frameRate()/60);
    
    gerarNuvens();
  
    gerarCactos(); 
    
    if (trex.isTouching(Cacto_group)){
      //trex.velocityY = -20;
      //pulo.play()
      EstadoJogo = ENCERRAR
      morte.play()
    }
    
    if (Score%100 == 0 && Score > 0){
      checkPoint.play()
    }
    
  } else if(EstadoJogo === ENCERRAR){
    solo.velocityX = 0
    trex.velocityY = 0
    
    trex.changeAnimation("parado",trex_parado);
    
    Nuvem_group.setVelocityXEach(0);
    Cacto_group.setVelocityXEach(0);
    
    Cacto_group.setLifetimeEach(-1);
    Nuvem_group.setLifetimeEach(-1);
    
    Reiniciar.visible = true;
    Fim_do_jogo.visible = true;

    if(mousePressedOver(Reiniciar)||touches.length > 0){
      if(Score > HI){
        HI = Score
      }
      reinicia();
      touches = [];
    }
  }
}

function gerarNuvens(){
  
  if(frameCount%70 === 0){
    var Nuvem = createSprite (width+20,100);
    Nuvem.y = random(40,height/2+height/10);

    Nuvem.addImage(Nuvem_img);
    Nuvem.scale = 0.6;
    Nuvem.velocityX = -3;
    
    Nuvem.depth = trex.depth;
    trex.depth += 1;
    
    Nuvem.lifetime = width/Nuvem.velocityX+20;
    
    Nuvem_group.add(Nuvem)
  }
}

function gerarCactos(){
  
  if(frameCount%60 === 0){
    var Cacto = createSprite (width+20,height-45)

    Cacto.velocityX = -(6+Score*3/100);
    Cacto.lifetime = width/Cacto.velocityX+20;
    
    Fim_do_jogo.depth = Cacto.depth +1;
    Reiniciar.depth = Cacto.depth +1;
    
    var escolha = Math.round(random (1,6));
    
    switch (escolha){
      
      case 1 : Cacto.addImage(Cacto1_img);
        break;
      case 2 : Cacto.addImage(Cacto2_img);
        break;
      case 3 : Cacto.addImage(Cacto3_img);
        break;
      case 4 : Cacto.addImage(Cacto4_img);
        break;
      case 5 : Cacto.addImage(Cacto5_img);
        break;
      case 6 : Cacto.addImage(Cacto6_img);
        break;
        
      default : 
        break;
        
    }
    Cacto.scale = 0.5
    Cacto_group.add(Cacto)
  }
}

function reinicia(){
  EstadoJogo = JOGAR
  Cacto_group.destroyEach();
  Nuvem_group.destroyEach();
  Reiniciar.visible = false
  Fim_do_jogo.visible = false
  Score = 0
  trex.changeAnimation("correndo")
}