function Wheel(radius, x, y, xV, yV){
    
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.xV = xV;
    this.yV = yV;
    this.timeX = 0;
    this.timeY = 0;
    this.boundsX = true;
    this.boundsY = true;
    this.xSpeed;
    this.ySpeed;
    this.specialId = numInstances;
    
    numInstances++;
    randBallList[randBallList.length] = this; //haha clever, but not my original idea
    
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.ctx = this.canvas.getContext("2d");
    
    this.draw = function(){//draws the circle
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.ctx.stroke();
        
};    
}



function move(obj){//moves n deals with boundaries n physics
        obj.ctx.clearRect(obj.x - obj.radius - 1, obj.y - obj.radius - 1, 2*obj.radius + 2, 2*obj.radius + 2);
        
        if ((obj.x + obj.radius + 2>= 1400 || obj.x - obj.radius - 2<= 0) && obj.boundsX){//collisions /w border (border width is 2px remember)
            obj.xV = -obj.xSpeed*0.45;//<- again simulate loss
            obj.boundsX = false;
            obj.timeX = 0;
        }else if (!(obj.x >= 1400 - obj.radius - 2|| obj.x - obj.radius - 2<= 0))
            obj.boundsX = true;
        if ((obj.y + obj.radius + 2 >= 620 || obj.y -obj.radius - 2<= 0) && obj.boundsY){//collisions /w border HOLY SHIT IM SMART AS FUCK
            obj.yV = -obj.ySpeed*0.45;//<- to simulate loss from the collision
            obj.boundsY = false;
            obj.timeY = 0;
        }else if (!(obj.y + obj.radius + 2 >= 620 || obj.y -obj.radius - 2<= 0))
            obj.boundsY = true;
        
        //console.log( (obj.x >= 1400 - obj.radius - 2|| obj.x - obj.radius - 2<= 0));
        obj.xV *= 0.999; //<- FRICTION, turn off if u dont want
        obj.xSpeed = obj.xV + obj.xAccel*obj.timeX*obj.timeX;
        obj.ySpeed = obj.yV + obj.yAccel*obj.timeY*obj.timeY;
        obj.x += obj.xSpeed;
        obj.y += obj.ySpeed;
        obj.timeX+= 0.016;
        obj.timeY+= 0.016;
        
        
        //if (obj.xSpeed <= 0.02)
        //    obj.xSpeed = 0;
        if (Math.abs(obj.ySpeed) <= 0.001 && obj.y >= 620 - obj.radius - 2.1 && Math.abs(obj.yV) < 0.02){  //<- when it moves reaaaaal little           
            //console.log("done bouncing"); //<- simulating the normal force
            obj.yAccel = 0;
            obj.ySpeed = 0;
            obj.yV = 0;
            obj.y = 620 - obj.radius - 2;
        }
        obj.draw();
        localCounter++;
        killBallList[obj.specialId] = window.setTimeout(function(){
            move(obj);
        }, 16);
}


Wheel.prototype.yAccel = 9.8;// <- default yaccel
Wheel.prototype.xAccel = 0;

function genRandom(num){
    for(var i = 0; i < num; i++){
        var s = new Wheel(40*Math.random(), 200, 200, 20*Math.random(), 20*Math.random());
        move(s);
        randBallList[i] = s;
    }
}

var localCounter = 0;
var frameCount;
var numInstances = 0;
var randBallList = [];//<- list o' balls
var killBallList = []; //<- list of all the ball's id's to nae nae them after use (specifically window.timeout id's)

window.onload = function(){
    document.getElementById("spawn").onclick = function(){
        var x = new Wheel(Number(document.getElementById("radius").value), Number(document.getElementById("xpos").value), Number(document.getElementById("ypos").value), Number(document.getElementById("xv").value), Number(document.getElementById("yv").value));
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
            var x = new Wheel(12,12 + (i/6.28)*1350, 500 - (620*((Math.sin(i)*Math.sin(i))/(Math.PI/2))), 0, 0);
            move(x);
        }
    };
    document.getElementById("normal-wave-preset").onclick = function(){
        for (var i = 20; i < 1400; i+=50){
            var x = new Wheel(12, i, 500 - 310*(i/1400), 0, 0);
            move(x);
        }
    };
    document.getElementById("bell").onclick = function(){
        for (var i = 20; i < 1400; i+=40){
            var x = new Wheel(12, i, 500 - 310*Math.pow(Math.sin(((Math.PI/2) + (i/1400)*(Math.PI))),2), 0, 0);
            move(x);
        }
    };
    document.getElementById("yAccelGlobal").onchange = function(e){
        if (!document.getElementById("yAccelGlobal").value)
            Wheel.prototype.yAccel = 9.8
        else
            Wheel.prototype.yAccel = document.getElementById("yAccelGlobal").value;
    };
    document.getElementById("xAccelGlobal").onchange = function(e){
        if (!document.getElementById("xAccelGlobal").value)
            Wheel.prototype.xAccel = 0;
        else
            Wheel.prototype.xAccel = document.getElementById("xAccelGlobal").value; 
    };
    
    var f = document.getElementById("output");
    frameCount = f;
    var cnvs = document.getElementsByTagName("canvas")[0];
    var clearid;
    cnvs.onmousedown = function(e){
        
        var id = window.setInterval(function(){randBallList.forEach(function(item){
            
            //var ctx = e.target.getContext("2d");
            var h = Math.sqrt(Math.pow(667 - e.clientY - (620 - item.y), 2) + Math.pow(e.clientX - 60 - (item.x), 2));
            var height = (667 - e.clientY - (620 - item.y));
            var width = (e.clientX - 60 - (item.x));
            var str = 2;
            
            item.timeX = 3;
            item.timeY = 3;
            
            //ctx.beginPath();
            //ctx.moveTo(e.clientX - 60, e.clientY - 47);   <- shit draws a triangle lmao
            //ctx.lineTo(item.x, item.y);
            //ctx.lineTo(e.clientX - 60, item.y);
            //ctx.lineTo(e.clientX - 60, e.clientY - 47);
            //ctx.stroke();
            
            Wheel.prototype.yAccel = -(height/h)*str;
            Wheel.prototype.xAccel = (width/h)*str;
        });
                                    }, 50);
        
        clearid = id;
};
    cnvs.onmouseup = function(){
        window.clearInterval(clearid);
        Wheel.prototype.yAccel = 9.8;
        Wheel.prototype.xAccel = 0;
        randBallList.forEach(function(item){item.timeX = 1; item.timeY = 1; item.xV = item.xSpeed; item.yV = item.ySpeed - 2;}); //the minus 2 was for sum inertia
    };
};
function setFPS(s){
    frameCount.innerHTML = Math.round(localCounter/numInstances);
}

window.setInterval(function(){
    setFPS(frameCount);
    localCounter = 0;
}, 1000);

