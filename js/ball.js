/* 
* This class "Ball" is used to generate every ball object within the testing field. 
*   @param radius: the radius of the ball
*   @param x: the x coordinate of the ball within the testing field
*   @param y: the y coordinate of the ball within the testing field (this is inverted from usual, with 0 starting from the top)
*   @param xV: the x component of velocity of the ball
*   @param yV: the y component of the velocity of the ball
*   @variable timeX: the time variable used in the x velocity kinematic equations.
*   @variable timeY: the time variable used in the y velocity kinematic equations.
*   --note-- the timeX and timeY variables are separated to allow the xV and yV to be independent of one another.
*   @variable boundsX: a boolean tracking if the Ball object is within x Bounds
*   @variable boundsY: a boolean tracking if the Ball object is within y Bounds
*   @variable groundedY: a boolean tracking if the Ball object is grounded with respect to its Y position
*   @variable groundedX: a boolean tracking if the Ball object is grounded with respect to its X position
*   @variable xSpeed: closely related to xV, this variable is used to aid in incremental calculations within the move() function
*   @variable ySpeed: closely related to yV, this variable is used to aid in incremental calculations within the move() funtion
*   @variable specialId: the Id unique to the Ball object instance, used to call clearInterval(specialId) when clearing the Ball object from the testing field
*   @variable xAccel: the x acceleration value local to the Ball object instance (defaults to the Ball.prototype.globalXAccel value)
*   @variable yAccel: the y acceleration value local to the Ball object instance (defaults to the Ball.prototype.globalYAccel value)
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

        //This function draws a circle at the specified x and y coordinates of the Ball object.
        this.draw = function(){
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            this.ctx.stroke();
            
    };    
        //This function resets the Ball objects personal x and y components of acceleration using the global x and y values of acceleration available
        this.resetAccel = function(){
            this.yAccel = Ball.prototype.globalYAccel;
            this.xAccel = Ball.prototype.globalXAccel;
        }
    }
    }
    
    
    /*
    * This function takes Ball type objects and moves them with respect to their initialized variable values. It also deals with collisions with the testing fields borders.
    * The motion of the Ball type objects is inspired by kinematics, with some deviations.
    *   @param obj: this variable represents the inputted Ball object
    */
    function move(obj){
            obj.ctx.clearRect(obj.x - obj.radius - 1, obj.y - obj.radius - 1, 2*obj.radius + 2, 2*obj.radius + 2);
            
            //conditional statements that deal with collisions w/ left and right border (border width is 2px hence the - 2)
            if ((obj.x + obj.radius + 2>= 1400 || obj.x - obj.radius - 2<= 0) && obj.boundsX){
                obj.xV = -obj.xSpeed*0.8;//<- again simulate loss
                obj.boundsX = false;
                obj.timeX = 0;
            }else if (!(obj.x >= 1400 - obj.radius - 2|| obj.x - obj.radius - 2<= 0))
                obj.boundsX = true;


            //conditional statements that deal with collisions w/ top and bottom border (again - 2 because of border)
            if ((obj.y + obj.radius + 2 >= 620 || obj.y -obj.radius - 2<= 0) && obj.boundsY){
                obj.yV = -obj.ySpeed*0.8;//<- to simulate loss from the collision
                obj.boundsY = false;
                obj.timeY = 0;
            }else if (!(obj.y + obj.radius + 2 >= 620 || obj.y -obj.radius - 2<= 0))
                obj.boundsY = true;
            
            obj.xV *= 0.995; // used to simulate horizontal drag, change to 1 if unwanted
            obj.yV *= 0.995 // used to simulate verticle drag, change to 1 if unwanted
            obj.xSpeed = obj.xV + obj.xAccel*obj.timeX;
            obj.ySpeed = obj.yV + obj.yAccel*obj.timeY;
            obj.x += obj.xSpeed;
            obj.y += obj.ySpeed;
            obj.timeX+= 0.016;
            obj.timeY+= 0.016;
            
            /*
            * These conditional statements each check whether the Ball's speed and velocity is approaching zero due to repeated collisions with the border.
            * If they are, they set these values to 0 respectivley to avoid runaway calculations, and set the correct grounded variable to true.
            *
            */
            if (Math.abs(obj.ySpeed) <= 1 && obj.y >= 620 - obj.radius - 2.1 && Math.abs(obj.yV) < 1){  //<- when it moves reaaaaal little and is on the ground   
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
    
            /*
            * the lines below draw the Ball object, increment the localCounter variable, and append a move(obj) call to window.setTimeout to continue calling
            * move(obj) every 16 ms, which is rougly 60 frames per second. Local counter aids in calculating the fps of the simulation by counting every frame of 
            * every Ball object instance.
            */
            obj.draw();
            localCounter++;
            killBallList[obj.specialId] = window.setTimeout(function(){
                move(obj);
            }, 16);
    }
    
    // These lines assign the default y and x accelerations of the program. I chose 9.8 and 0 to mimic real life.
    Ball.prototype.globalYAccel = 9.8;// <- default yaccel
    Ball.prototype.globalXAccel = 0;
    

    /*
    * This function generations a specified number of Balls with randomized radii.
    *   @param num: the number of Balls to be generated.
    */
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
    var randBallList = []; // contains every ball object
    var killBallList = []; // list of all the ball's id's to clear them when needed (specifically window.timeout id's)
    var cnvs = document.getElementsByTagName("canvas")[0];
    
    // this onload function assigns the correct functions to certain html elements through one of their JavaScript event handler.
    window.onload = function(){
        // spawns a customized Ball object using user input
        document.getElementById("spawn").onclick = function(){
            var x = new Ball(Number(document.getElementById("radius").value), Number(document.getElementById("xpos").value), Number(document.getElementById("ypos").value), Number(document.getElementById("xv").value), Number(document.getElementById("yv").value));
            move(x);
        };
        // spawns a random array of Balls using the genRandom() function
        document.getElementById("genRandom").onclick = function(){
            genRandom(Number(document.getElementById("numb").value));
        };
        // clears all Ball object instances using killBallList array
        document.getElementById("clear").onclick = function(){
            killBallList.forEach(function(item){
               window.clearInterval(item);
            });
            numInstances = 0;
            randBallList = [];
            var ctx = cnvs.getContext("2d");
            ctx.clearRect(0, 0, 1400, 620);
        };
        
        // below are a couple of presets I made since I thought they looked cool.
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
        // These two anonymous functions deal with changing the individual Ball object instance's acceleration values depending on the user input. They also deal with
        // edge cases, such as being grounded.
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

    // function aiding in the calculation of fps (frames per second). (total number of frames in a second/number of object instances) = frames per second
    function setFPS(){
        frameCount.innerHTML = Math.round(localCounter/numInstances);
    }
    
    // updates the frames per second field on the html page
    window.setInterval(function(){
        setFPS();
        localCounter = 0;
    }, 1000);
    
    