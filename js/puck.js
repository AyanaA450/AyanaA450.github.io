window.onload = function(){
    
    var speedX = 3;
    var speedY = 3;
    var dx = speedX; var dy = speedY;
    var p = document.getElementById("puck");
    var score = 0;
    
    function movePuck(){
        
        if (dx + 20 >= p.parentElement.clientWidth || dx <= 0){
            speedX = -speedX;
            document.getElementById("output").innerText = 0;
            score = 0;
        }
        if (dy + 20 >= p.parentElement.clientHeight || dy <= 0){
            speedY = -speedY;
            document.getElementById("output").innerText = 0;
            score = 0;
        }
        
        dy+= speedY;
        dx+= speedX;
        
        
        p.style.top = dy + "px";
        p.style.left = dx + "px";
        
        
        setTimeout(movePuck, 15);
    }
    
    p.onmousedown = function(event){
        score++;
        document.getElementById("output").innerText = score;
        if (event.button == 0)
            speedX = -speedX;
        if (event.button == 2)
            speedY = -speedY;
    };
    
    
    movePuck();
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}