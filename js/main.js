"use-strict";
/*Aight so this the beginning of my website shennanigans
 *Let see how long it takes for me to quit
 */

window.onload = function(){

    var paintButton = document.getElementById("paint");
    var puckButton = document.getElementById("puck");
    var physButton = document.getElementById("phys");
    
    paintButton.onclick = function(){
        location.href = "paint.html";
    };
    
    puckButton.onclick = function(){
        location.href = "puck.html";
    };
    
    physButton.onclick = function(){
        location.href = "ball.html";
    }

}
