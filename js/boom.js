/* This class "Wheel" is used to generate 
*
*/
class Ball{

constructor(radius, x, y, xV, yV){
    
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.xV = xV;
    this.yV = yV;
    this.timeX = 0;
    this.timeY = 0;
    this.boundsX = true;
    this.boundsY = true;
    this.groundedY = false;
    this.groundedX = false;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.specialId = numInstances;
    this.xAccel = Ball.prototype.globalXAccel;
    this.yAccel = Ball.prototype.globalYAccel;

    numInstances++;
    randBallList[randBallList.length] = this; 
    
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.ctx = this.canvas.getContext("2d");
    this.draw = function(){//draws the circle
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.ctx.stroke();
        
};    
    this.resetAccel = function(){
        this.yAccel = Ball.prototype.globalYAccel;
        this.xAccel = Ball.prototype.globalXAccel;
    }
}
}



function move(obj){//moves n deals with boundaries n physics
        obj.ctx.clearRect(obj.x - obj.radius - 1, obj.y - obj.radius - 1, 2*obj.radius + 2, 2*obj.radius + 2);
        if ((obj.x + obj.radius + 2>= 1400 || obj.x - obj.radius - 2<= 0) && obj.boundsX){//collisions /w border on sides (border width is 2px hence the - 2)
            obj.xV = -obj.xSpeed*0.8;//<- again simulate loss
            obj.boundsX = false;
            obj.timeX = 0;
        }else if (!(obj.x >= 1400 - obj.radius - 2|| obj.x - obj.radius - 2<= 0))
            obj.boundsX = true;
        if ((obj.y + obj.radius + 2 >= 620 || obj.y -obj.radius - 2<= 0) && obj.boundsY){//collisions /w border on top and bottm (again - 2 because of border)
            obj.yV = -obj.ySpeed*0.8;//<- to simulate loss from the collision
            obj.boundsY = false;
            obj.timeY = 0;
        }else if (!(obj.y + obj.radius + 2 >= 620 || obj.y -obj.radius - 2<= 0))
            obj.boundsY = true;
        
        // console.log(obj.ySpeed, obj.y, obj.boundsY);
        obj.xV *= 0.995; //<- Horizontal Drag, turn off if u dont want
        // obj.yV *= .07;
        obj.xSpeed = obj.xV + obj.xAccel*obj.timeX;
        obj.ySpeed = obj.yV + obj.yAccel*obj.timeY;
        obj.x += obj.xSpeed;
        obj.y += obj.ySpeed;
        obj.timeX+= 0.016;
        obj.timeY+= 0.016;
        
        //if (obj.xSpeed <= 0.02)
        //    obj.xSpeed = 0;
        //console.log(Math.abs(obj.ySpeed) <= 0.1,obj.y >= 620 - obj.radius - 2.1,Math.abs(obj.yV) < 0.1);
        if (Math.abs(obj.ySpeed) <= 1 && obj.y >= 620 - obj.radius - 2.1 && Math.abs(obj.yV) < 1){  //<- when it moves reaaaaal little and is on the ground   
            //console.log("done bouncing"); //<- simulating the normal force by supporting object
            obj.yAccel = 0;
            obj.ySpeed = 0;
            obj.yV = 0;
            obj.y = 620 - obj.radius - 2;
            obj.groundedY = true;
        }
        else if (Math.abs(obj.ySpeed) <= 1 && obj.y <= 0 + obj.radius + 2.1 && Math.abs(obj.yV) < 1){// on the roof
            obj.yAccel = 0;
            obj.ySpeed = 0;
            obj.yV = 0;
            obj.y = 0 + obj.radius + 2;
            obj.groundedY = true;
        }else if (Math.abs(obj.xSpeed) <= 1 && obj.x <= 0 + obj.radius + 2.1 && Math.abs(obj.xV) < 1){// on the left wall
            obj.xAccel = 0;
            obj.xSpeed = 0;
            obj.xV = 0;
            obj.x = 0 + obj.radius + 2;
            obj.groundedX = true;
        }else if (Math.abs(obj.xSpeed) <= 1 && obj.x >= 1400 - obj.radius - 2.1 && Math.abs(obj.xV) < 1){// on the right wall
            obj.xAccel = 0;
            obj.xSpeed = 0;
            obj.xV = 0;
            obj.x = 0 + obj.radius + 2;
            obj.groundedX = true;
        }








        obj.draw();
        localCounter++;
        killBallList[obj.specialId] = window.setTimeout(function(){
            move(obj);
        }, 16);
}


Ball.prototype.globalYAccel = 9.8;// <- default yaccel
Ball.prototype.globalXAccel = 0;

function genRandom(num){
    for(var i = 0; i < num; i++){
        var s = new Ball(40*Math.random(), 200, 200, 20*Math.random(), 20*Math.random());
        move(s);
        randBallList[i] = s;
    }
}

var localCounter = 0;
var frameCount;
var numInstances = 0;
var randBallList = [];//<- list o' balls
var killBallList = []; //<- list of all the ball's id's to delete them after use (specifically window.timeout id's)
var cnvs = document.getElementsByTagName("canvas")[0];

window.onload = function(){
    document.getElementById("spawn").onclick = function(){
        var x = new Ball(Number(document.getElementById("radius").value), Number(document.getElementById("xpos").value), Number(document.getElementById("ypos").value), Number(document.getElementById("xv").value), Number(document.getElementById("yv").value));
        move(x);
    };
    document.getElementById("genRandom").onclick = function(){
        genRandom(Number(document.getElementById("numb").value));
    };
    document.getElementById("clear").onclick = function(){
        killBallList.forEach(function(item){
           window.clearInterval(item);
           
        });
        numInstances = 0;
        randBallList = [];
        var ctx = cnvs.getContext("2d");
        ctx.clearRect(0, 0, 1400, 620);
    };
    document.getElementById("wave-preset").onclick = function(){
        for (var i = 0; i < 6.28; i+=0.157){
            var x = new Ball(12,12 + (i/6.28)*1350, 500 - (620*((Math.sin(i)*Math.sin(i))/(Math.PI/2))), 0, 0);
            move(x);
        }
    };
    document.getElementById("normal-wave-preset").onclick = function(){
        for (var i = 20; i < 1400; i+=50){
            var x = new Ball(12, i, 500 - 310*(i/1400), 0, 0);
            move(x);
        }
    };
    document.getElementById("bell").onclick = function(){
        for (var i = 20; i < 1400; i+=40){
            var x = new Ball(12, i, 500 - 310*Math.pow(Math.sin(((Math.PI/2) + (i/1400)*(Math.PI))),2), 0, 0);
            move(x);
        }
    };
    document.getElementById("yAccelGlobal").onchange = function(e){
        if (!document.getElementById("yAccelGlobal").value)
            Ball.prototype.globalYAccel = 9.8
        else
            Ball.prototype.globalYAccel = Number(document.getElementById("yAccelGlobal").value);

        randBallList.forEach(function(ball){
            ball.resetAccel();
            ball.ySpeed = 0;
            ball.yV = 0;
            ball.timeY = 0;
            if (ball.groundedY && ball.y > 300){
                ball.y -=2;
                ball.ySpeed = 10;
                ball.groundedY = false;
            }else if (ball.groundedY && ball.y < 300){
                ball.y += 2;
                ball.ySpeed = -10;
                ball.groundedY = false;
            }
        });
        cnvs.getContext("2d").clearRect(0, 0, cnvs.width, cnvs.height);
    };
    document.getElementById("xAccelGlobal").onchange = function(e){
        if (!document.getElementById("xAccelGlobal").value)
            Ball.prototype.globalXAccel = 0;
        else
            Ball.prototype.globalXAccel = Number(document.getElementById("xAccelGlobal").value); 
            
            randBallList.forEach(function(ball){
                ball.resetAccel();
                ball.xSpeed = 0;
                ball.xV = 0;
                ball.timeX = 0;
                if (ball.groundedX && ball.x > 700){
                    ball.x -=2;
                    ball.xSpeed = 10;
                    ball.groundedX = false;
                }else if (ball.groundedX && ball.x < 700){
                    ball.x += 2;
                    ball.xSpeed = -10;
                    ball.groundedX = false;
                }
            });
        cnvs.getContext("2d").clearRect(0, 0, cnvs.width, cnvs.height);
        };
    
    var f = document.getElementById("output");
    frameCount = f;
};
function setFPS(s){
    frameCount.innerHTML = Math.round(localCounter/numInstances);
}

window.setInterval(function(){
    setFPS(frameCount);
    localCounter = 0;
}, 1000);

