//The Focal Point of the Tank
var TankBodyW;

//Pipe values for both tanks
var pipe1;
var pipe2;
var pipe1Rotation = 0;
var pipe2Rotation = 0;

//All player 1 and player 2 data
var player1;
var player2;
var player1Color= "#228B22";
var player2Color= "#1E90FF";
var player1Lives = 3;
var player2Lives = 3;
var player1PowerText;
var player2PowerText;

//Represents who's turn it is
var playerTurn = 1;

//All bullet related variables
var bullet;
var bulletX;
var bulletY;
var bulletShot=false;
var player1Power=0;
var player2Power=0;
var shootingTrajectory;
var canShoot= true;

//Start of trajectory equation which increased every time the function runs
var player1Start;
var player2Start;


//Wind variables
var wind= Randomizer.nextInt(0,75);
var windText;

//Variables for the middle pillar
var middlePillar;
var middlePillarH;

//LifeBar variables 
var player1LifeBar1;
var player1LifeBar2;
var player1LifeBar3;
var player2LifeBar1;
var player2LifeBar2;
var player2LifeBar3;

//Background variable
var backgroundImage = "https://codehs.com/uploads/d713f714bc6c93af35e7289698aa904e";

//Variable to run the lose() function
var lost = false;

//All the lose() function variables 
var endScreen;
var oneWin;
var twoWin;
var play;
var playText;


function start(){
 setSize(500,440);  //Sets the screen size or ratio
 setup();           //Runs all the necessary functions and commands to start the game
 
 
 
 
  
}

//Starts the game with everyone on the screen
function setup(){
     keyDownMethod(playerMoves);
    drawImage(0,0,getWidth(),getHeight(),Color.white, backgroundImage,0);
    windText = drawText(wind, "20pt Arial Black", getWidth()/2*0.925, getHeight()*1/10, Color.white );
    player2=drawTank(470/500 * getWidth(), 350/440 * getHeight(), 27.5/500*getWidth(), "#1E90FF",2); 
    player1=drawTank(30/500 * getWidth(),350/440 * getHeight(),27.5/500 * getWidth(), player1Color,1);
    editPillar();
    drawRectangle(getWidth(),90/440*getHeight(),0,355/440 * getHeight(),Color.black,0);
    drawLifeBar();
    player1PowerText = drawText(player1Power,"20pt Arial Black",getWidth()/40, getHeight()*9/10, Color.white);
    player2PowerText = drawText(player2Power, "20pt Arial Black", getWidth()*35/40, getHeight() * 9/10, Color.white);
    drawBorders();
    setTimer(game,1);
    mouseClickMethod(playAgainMenu);
    
}

//Being set on a Timer "setTimer(game,1)
function game(){
    shoot();
    bulletColliderCheck();
    getBulletPosition();
}

//Function to draw the two tanks
function drawTank(x,y,bodyW,color,playerNumber){
    TankBodyW = bodyW;
    if(playerNumber == 1){
    pipe1 = drawRectangle(TankBodyW, TankBodyW/6, x-TankBodyW/5 , y - TankBodyW/2, "#808080", 1);
    }else{
    pipe2 = drawRectangle(TankBodyW, TankBodyW/6, x-TankBodyW/1.25 , y - TankBodyW/2, "#808080", 1);
    }
    drawRectangle(TankBodyW * 1.05, TankBodyW/3*1.1,x - TankBodyW*1.05/2, y - TankBodyW/2/1.8,"#808080", 0 );
    drawRectangle(TankBodyW*3/4 * 1.1, TankBodyW/2 * 1.05, x - TankBodyW*3/4 * 1.1 /2, y - TankBodyW/1.65, "#808080",0 );
    drawRectangle(TankBodyW, TankBodyW/3, x - TankBodyW/2, y - TankBodyW/2/2, color, 0);
    drawRectangle(TankBodyW*3/4, TankBodyW/2, x - TankBodyW*3/4/2, y - TankBodyW/1.75, color,0);
    for(var i = 0 ; i < 3; i++ ){
        drawCircle(TankBodyW/6, x - TankBodyW/3 + TankBodyW/3*i,y +TankBodyW/7,Color.black);
    }
}

//Function to set keyboard values for different moves
function playerMoves(e){
    if(lost != true){ 
    if(playerTurn == 1){
        if(e.keyCode == Keyboard.letter('Z')){
            if(player1Power >=1 && player1Power <=119){
                player1Power-=1;
                updatePower();
            }
        }
        if(e.keyCode == Keyboard.letter('X')){
            if(player1Power >=0 && player1Power<=119){
                player1Power+=1;
                updatePower();
            }
        }
        if(e.keyCode == Keyboard.letter('D') && canShoot == true){
            bullet=drawCircle(2.5/500 * getWidth(), bulletX,bulletY, Color.red);
            player1Start= bulletX;
            bulletShot=true;
        }
        if(e.keyCode == Keyboard.letter('W')){
            if(pipe1Rotation != -90){
                pipe1.setRotation(pipe1Rotation-= 2);
            }
        }
        if(e.keyCode == Keyboard.letter('S')){
            if(pipe1Rotation<=-3){
            pipe1.setRotation(pipe1Rotation +=2);
            }   
        }
    }
    if(playerTurn == 2){
         if(e.keyCode == Keyboard.letter('M')){
             if(player2Power >=0 && player2Power <=149){
                 player2Power+=1;
                 updatePower();
            }
         }
         if(e.keyCode == Keyboard.letter('N')){
             if(player2Power >=1 && player2Power <= 119){
                 player2Power-=1;
                 updatePower();
             }
         }
         if(e.keyCode == Keyboard.LEFT && canShoot == true){
             bullet = drawCircle(2.5/500 * getWidth(),bulletX,bulletY,Color.red);
             player2Start = bulletX;
             bulletShot = true;
        }
        if(e.keyCode == Keyboard.UP){
            if(pipe2Rotation != 90){
                pipe2.setRotation(pipe2Rotation+=2);
               }
        }
        if(e.keyCode == Keyboard.DOWN){
            if(pipe2Rotation>=3){
            pipe2.setRotation(pipe2Rotation -=2);
            
                }   
            }
        }   
    }
}

//Moves the bullet based on the power and wind in a quadratic equation 
function shoot(){
    if(playerTurn==1){
       if(bulletShot==true){
        
        player1Start+=3.5;
        shootingTrajectory = -(-1 * pipe1Rotation/10000)*(player1Start - bulletX)*(player1Start- getWidth()/90 * 2*player1Power+ 1.5*wind);
       
        bullet.setPosition(player1Start,pipe1.getY()-shootingTrajectory);
        canShoot = false;
        
        }
     }
    if(playerTurn==2){
        if(bulletShot==true){
            player2Start-=3.5;
            shootingTrajectory = (-1 * pipe2Rotation/10000)*(player2Start - bulletX +getWidth()/90 * 2*player2Power-1.5*wind)*(player2Start - bulletX);
            bullet.setPosition(player2Start, pipe2.getY()- shootingTrajectory);
            canShoot = false;
        }
    }
}

// Returns the position X and Y of the bullet position on the canvas
function getBulletPosition(){
    if(playerTurn==1){
        bulletX = pipe1.getX()+pipe1.getWidth() - (pipe1.getWidth()/2 - Math.cos(pipe1Rotation*Math.PI/180) * pipe1.getWidth());
        bulletY = pipe1.getY()+pipe1.getHeight()/2 + (Math.sin(pipe1Rotation*Math.PI/180) * pipe1.getWidth());
    }
    if(playerTurn==2){
        bulletX = pipe2.getX() + (pipe2.getWidth()/2 - Math.cos(pipe2Rotation*Math.PI/180)* pipe2.getWidth());
        bulletY = pipe2.getY()+pipe2.getHeight()/2 - (Math.sin(pipe2Rotation*Math.PI/180)* pipe2.getWidth());
    }
}

// Checks what the bullet hits and does the correct things in response 
function bulletColliderCheck(){
    var Collider = getBulletCollider();
   if(lost != true){
    if(playerTurn==1&&Collider!=null){
       if(Collider.getColor()==Color.black){
            remove(bullet);
            bulletShot = false;
            wind=Randomizer.nextInt(1,75);
            updateWind();
            canShoot = true;
            playerTurn = 2;
            editPillar();
            return;
            
        }
            if(Collider.getColor() == player2Color||Collider.getColor()=="#696969"){
           remove(bullet);
            removeLives();
            playerTurn=2;
            bulletShot=false;
            wind=Randomizer.nextInt(0,75);
            updateWind();
            canShoot = true;
            editPillar();
            return;
        }
        
    }
    if(playerTurn ==2 && Collider !=null){
        if(Collider.getColor() == player1Color){
            remove(bullet);
            removeLives();
            playerTurn=1;
            bulletShot=false;
            wind=Randomizer.nextInt(0,75);
            updateWind();
            canShoot = true;
            editPillar();
            return;
         }
         if(Collider.getColor()== Color.black||Collider.getColor()=="#696969"){
             remove(bullet);
             playerTurn =1;
             bulletShot = false;
             wind=Randomizer.nextInt(0,75);
             updateWind();
             canShoot = true;
             editPillar();
             return;
            }
        }
    }
}

//Function to update the power on the screen
function updatePower(){
    if(playerTurn ==1){
        player1PowerText.setText(player1Power);
    }
    if(playerTurn ==2){
        player2PowerText.setText(player2Power);
    }
}

//Function to update the wind on the screen
function updateWind(){
    windText.setText(wind);
}

// Creates colliders on the bottom,left and right 
function getBulletCollider(){
    var element = null;
    if(bulletShot == true){  
        var bottom = getElementAt(bullet.getX(), bullet.getY()+bullet.getRadius());
        if(bottom != null){
            element = bottom;
        }
        var left = getElementAt(bullet.getX() - bullet.getRadius(), bullet.getY());
        if(left != null){
             element = left;
        }
        var right = getElementAt(bullet.getX() + bullet.getRadius(), bullet.getY());
        if(right != null){
            element = right;
        }
    }
    return element;
}

//Creates borders around the screen so bullet cant travel forever
function drawBorders(){
    drawRectangle(getWidth(), getHeight(),0-getWidth(),0,Color.black,0);
     drawRectangle(getWidth(), getHeight(), getWidth(), 0, Color.black,0);
    drawRectangle(getWidth(),getHeight(),0,0-getHeight(),Color.black,0)
}

//Creates the life bar on the screen for both players 
function drawLifeBar(){
    drawRectangle(100/500 * getWidth(),25/440 * getHeight(),0,400/440 * getHeight(), Color.white, 0);
    drawRectangle(100/500 * getWidth(),25/440 * getHeight(),getWidth()-100/500 * getWidth(),400/440 * getHeight(),Color.white,0);
    player1LifeBar1 = drawRectangle(100/3/500 * getWidth(), 100/4/440 * getHeight(), 0, 400/440*getHeight(), Color.green,0);
    player1LifeBar2=drawRectangle(100/3/500 * getWidth(),100/4/440*getHeight(),0+100/3/500 * getWidth(),400/440*getHeight(),Color.green,0);
    player1LifeBar3=drawRectangle(100/3/500 * getWidth(),100/4/440 * getHeight(),0+100/3*2/500 * getWidth(),400/440 * getHeight(),Color.green,0);
    player2LifeBar1=drawRectangle(100/3/500 * getWidth(),100/4/440 * getHeight(),getWidth()-100/500 * getWidth(),400/440*getHeight(),Color.green,0);
    player2LifeBar2=drawRectangle(100/3/500 * getWidth(),100/4/440 * getHeight(),getWidth()-100*2/3/500 * getWidth(),400/440 * getHeight(),Color.green,0);
    player2LifeBar3=drawRectangle(100/3/500 * getWidth(),100/4/440 * getHeight(),getWidth()-100*1/3/500 * getWidth(),400/440 * getHeight(),Color.green,0);
    
}

//Removes life count when player is hit and removes lifeBars
function removeLives(){
    if(player1Lives!=0 && playerTurn == 2){
        if(player1Lives == 3){
            remove(player1LifeBar3);
            player1Lives-=1;
            return;
        }
        if(player1Lives ==2){
            remove(player1LifeBar2);
            player1Lives-=1;
            return;
            }
        if(player1Lives ==1){
            remove(player1LifeBar1);
            player1Lives-=1;
            remove(middlePillar);
            lose();
            return;
        }
    }
    if(player2Lives !=0 && playerTurn ==1){
        if(player2Lives ==3){
            remove(player2LifeBar3);
            player2Lives -=1;
            return;
        }
        if(player2Lives ==2){
            remove(player2LifeBar2);
            player2Lives -=1;
            return;
        }
        if(player2Lives ==1){
            remove(player2LifeBar1);
            player2Lives -=1;
            remove(middlePillar);
            lose();
            return;
        }
    }
}

//Lose function to end the game after someone wins
function lose(){
    
    canShoot = false;
    lost= true;
    endScreen = drawRectangle(getWidth(),getHeight(),0,0,"#BDB76B", 0);
    
    if(player1Lives == 0){
         twoWin =  drawImage(getWidth()/2-getWidth()*0.75/2.1, getHeight()/3, getWidth()*0.75, getHeight()/7,Color.red, "https://codehs.com/uploads/d66d94ad1d653f7533de9f2e207324e7",0);
    }
    if(player2Lives == 0){
          oneWin = drawImage(getWidth()/2-getWidth()*0.75/2.1, getHeight()/3, getWidth()*0.75, getHeight()/7,Color.red, "https://codehs.com/uploads/5f61ea86528eb316a1bb60d4ad396c79",0);
    }
     play = drawRectangle(getWidth()/3, getHeight()/9, getWidth()/2-getWidth()/3/2, getHeight()*0.7, Color.white, 0);
     playText = drawImage(getWidth()/2-getWidth()/3/2, getHeight()*0.71, getWidth()/3, getHeight()/9, Color.white, "https://codehs.com/uploads/70b1d98db08667eb1adc55cd5d8da477",0);
}

//MouseClick function that works only when end game menu pops up
function playAgainMenu(e){
    var element = getElementAt(e.getX(),e.getY());
    if(element != null && lost == true && element.getColor() == Color.white){
        add(player1LifeBar1);
        add(player1LifeBar2);
        add(player1LifeBar3);
        add(player2LifeBar1);
        add(player2LifeBar2);
        add(player2LifeBar3);
        player1Lives = 3;
        player2Lives = 3;
        remove(endScreen);
        remove(oneWin);
        remove(twoWin);
        remove(play);
        remove(playText);
        canShoot = true;
        playerTurn =1;
        lost = false;
    }
}

// Function that randomizes the height of the pillar in the middle 
function editPillar(){
   if(lost !=true){ 
    middlePillarH = Randomizer.nextInt(200/440* getHeight(),350/440 * getHeight());
    remove(middlePillar);
    middlePillar = drawRectangle(50/500 * getWidth(), middlePillarH, getWidth()/2 -50/500 * getWidth()/2, getHeight()-middlePillarH, Color.black, 0);
   }
}




   
//Lowest Level Abstractions

function drawRectangle(width,height ,x,y ,color,rotation){
    var rec = new Rectangle(width, height);
    rec.setColor(color);
    rec.setPosition(x,y);
    rec.setRotation(rotation);
    add(rec);
    return rec;
}
function drawCircle(radius,x,y,color){
    var circ = new Circle(radius);
    circ.setPosition(x,y);
    circ.setColor(color);
    add(circ);
    return circ;
}
function drawText(text, font,  x , y , color ){
    var text = new Text(text, font);
    text.setColor(color);
    text.setPosition(x,y);
    add(text);
    return text;
}
function drawImage(x,y,width,height,color,url, rotation) {
    var picture = new WebImage(url);
    picture.setSize(width,height);
    picture.setPosition(x,y);
    picture.setColor(color);
    picture.setRotation(rotation, 0);
    add(picture);
    return(picture);
}