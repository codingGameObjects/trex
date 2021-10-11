var INICIAR = 0;
var JOGAR = 1;
var ENCERRAR = 2;
var estadoJogo = INICIAR;

var trex, trex_correndo, trex_colidiu, trex_agachado, trex_inicio;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupodenuvens, imagemdanuvem;
var grupodeobstaculos, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6, morcego;

var pontuacao;
var imgFimDeJogo,imgReiniciar;
var somSalto , somCheckPoint, somMorte;


function preload(){
  trex_correndo = loadAnimation("trex0C.png", "trex1C.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  trex_agachado = loadAnimation("agachado1C.png", "agachado2C.png");
  trex_inicio = loadAnimation("iniciar01C.png", "iniciar02C.png", "iniciar03C.png", "iniciar04C.png", "iniciar05C.png", "iniciar06C.png", "iniciar07C.png", "iniciar08C.png", "iniciar09C.png", "iniciar10C.png", "iniciar11C.png");
  trex_pulo = loadAnimation("pulandoC.png");
  
  imagemdosolo = loadImage("soloC.png");
  
  imagemdanuvem = loadImage("nuvemC.png");
  
  star1 = loadImage("estrela0C.png");
  star2 = loadImage("estrela1C.png");
  star3 = loadImage("estrela2C.png");
  
  cacto1 = loadImage("cacto1C.png");
  cacto2 = loadImage("cacto2C.png");
  cacto3 = loadImage("cacto3C.png");
  cacto4 = loadImage("cacto4C.png");
  cacto5 = loadImage("cacto5C.png");
  cacto6 = loadImage("cacto6C.png");
  morcego = loadAnimation("morcego0C.png", "morcego1C.png");
    
  imgReiniciar = loadAnimation("reset00C.png", "reset01C.png", "reset02C.png", "reset03C.png", "reset04C.png", "reset05C.png", "reset06C.png", "reset07C.png", "reset08C.png", "reset09C.png");
  imgFimDeJogo = loadImage("gameOver.png");
    
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  
  trex = createSprite(50,161.5,20,50);
  
  
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.addAnimation("agachado", trex_agachado);
  trex.addAnimation("inicio", trex_inicio);
  trex.addAnimation("pulo", trex_pulo)
  
  trex.scale = 1;
  
  solo = createSprite(200,180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
  fimDeJogo = createSprite(300,100);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(300,140);
  reiniciar.addAnimation("reseta", imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 1;
    
  soloinvisivel = createSprite(200,190,400,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeobstaculos = createGroup();
  grupodenuvens = createGroup();
  
  pontuacao = 0;
  
}

function draw() {
  background(0);
  //console.log(trex.y);
  if (trex.y >= 165){
    trex.y = 161.5;
  }
  if (estadoJogo === INICIAR){
    trex.scale = 1;
    trex.changeAnimation("inicio", trex_inicio);
    
    solo.visible = false;
    fimDeJogo.visible = false;
    reiniciar.visible = false;
    textSize(20)
    text ("aperte a tecla ESPAÇO para começar", 130, 100);
    if (keyWentUp("space") || keyWentUp("UP_ARROW")){
      estadoJogo = JOGAR
    }
  }
  else if(estadoJogo === JOGAR){
    
    solo.visible = true;
    fimDeJogo.visible = false;
    reiniciar.visible = false;
    
    //mudar a animação do Trex
    trex.changeAnimation("running", trex_correndo);
    trex.scale = 1;      
      
    //salta quando a tecla de espaço é pressionada
    if((keyDown("space") || keyDown("UP_ARROW")) && (trex.y >= 161.5)) {
      trex.velocityY = -12.5;
      somSalto.play();
    }

    if (keyDown("DOWN_ARROW") && ((keyDown("space") || keyDown("UP_ARROW")) === false)) {
      trex.changeAnimation("agachado", trex_agachado);
      trex.scale = 1;
      trex.velocityY = trex.velocityY + 4;
        if (trex.y == 161.5) {
          trex.y = 170;
        }
      }

    //adiciona gravidade
    trex.velocityY = trex.velocityY + 1;
  
    if (trex.y <= 160){
        trex.changeAnimation("pulo", trex_pulo);
    }

    if (pontuacao <= 1000){
      solo.velocityX = -(8 + pontuacao/100);
    } else if(pontuacao >= 1000){
      solo.velocityX = -18
    }
  
    //marcando pontuação
    if (pontuacao >= 0 && pontuacao <= 750){
      pontuacao = pontuacao + 0.5;
    }
    if (pontuacao >= 750){
      pontuacao = pontuacao + 1;
    }
    
    if(pontuacao>0 && pontuacao%100 === 0){
      somCheckPoint.play()
      fill(180);
    }
    
    if (solo.x < -70){
      solo.x = solo.width/2;
    }
      
    text("Pontuação: "+ Math.round(pontuacao), 500,50);
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeobstaculos.isTouching(trex)){
      //trex.velocityY = -12;
      //somSalto.play();
        estadoJogo = ENCERRAR; 
        somMorte.play()
      
    }
  }
    else if (estadoJogo === ENCERRAR) {
      
      text("Pontuação: "+ Math.round(pontuacao), 500,50);
      
      fimDeJogo.visible = true;
      reiniciar.visible = true;
      //altera a animação do Trex
      trex.changeAnimation("collided", trex_colidiu);
      trex.scale = 0.5;

      
      solo.velocityX = 0;
      trex.velocityY = 0
       
      
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
      grupodeobstaculos.setLifetimeEach(-1);
      grupodenuvens.setLifetimeEach(-1);
     
      grupodeobstaculos.setVelocityXEach(0);
      grupodenuvens.setVelocityXEach(0);  
      
      if(mousePressedOver(reiniciar) || keyWentUp("space") || keyWentUp("UP_ARROW")){
        estadoJogo = JOGAR;
        grupodenuvens.destroyEach();
        grupodeobstaculos.destroyEach();
        pontuacao = 0;
      }
    }
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);
  

  drawSprites();
}

function gerarObstaculos(){
  if (pontuacao % 20 === 0){
    var obstaculo = createSprite(600,165,10,40);
    if (pontuacao <= 1000){
      obstaculo.velocityX = -(8 + pontuacao/100);
    }  
    if(pontuacao >= 1000){
      obstaculo.velocityX = -18;
    }
    
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 1;
    obstaculo.lifetime = 300;
   
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
    
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,9));
    switch(rand) {
      case 1: obstaculo.addImage(cacto1);
              break;
      case 2: obstaculo.addImage(cacto2);
              break;
      case 3: obstaculo.addImage(cacto3);
              break;
      case 4: obstaculo.addImage(cacto4);
              break;
      case 5: obstaculo.addImage(cacto5);
              break;
      case 6: obstaculo.addImage(cacto6);
              break;
      case 7: obstaculo.addAnimation("piteru", morcego);
              obstaculo.y = 160;
              obstaculo.scale = 0.8;
              break;
      case 8: obstaculo.addAnimation("piteru", morcego);
              obstaculo.y = 140;
              obstaculo.scale = 0.8;
              break;
      case 9: obstaculo.addAnimation("piteru", morcego);
              obstaculo.y = 120;
              obstaculo.scale = 0.8;
              break;
      default: break;
    }
   
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(80,120));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 1;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}
function gerarEstrela() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(80,120));
    nuvem.addImage(imagemdanuvem);
    nuvem.scale = 1;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 200; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
        
    //adiciondo nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
}


