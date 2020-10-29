/* Javascript for the paint portion of my random website.
 */


//LITERALLY JUST THE TOOLBAR BELOW
var toolbar = document.getElementById("toolbar");
var toolbarButton = document.getElementById("toolbar-icon-button");


toolbarButton.onclick = function(){//animate toolbar up
    if (toolbarButton.value == "OFF"){
        animateToolbarUp(-170, 50, 140);
        toolbarButton.value = "ON";
    }else{
        animateToolbarDown(170, 50, 140);
        toolbarButton.value = "OFF";
    }
}
function animateToolbarUp(distance, vel, accl){
    
    //var accl = (distance - vel
    var currentDistance = 0;
    var move;
    let framekeeper = {frame: 0};
    var id = window.setInterval(function(){
        
        
        if (currentDistance <= distance){
            window.clearInterval(id);
            toolbar.setAttribute("style", "bottom:" + (currentDistance*-1) + "px");
        }else{
            
            move = updateFlow(framekeeper.frame, vel, accl);
            currentDistance -= move;
            framekeeper.frame++;
            toolbar.setAttribute("style", "transform:translateY("+ Math.round(currentDistance) +"px)");
        }
        
    }, 17);



}
function animateToolbarDown(distance, vel, accl){
    
    //var accl = (distance - vel
    var currentDistance = -155;
    var move;
    let framekeeper = {frame: 0};
    var id = window.setInterval(function(){
        
        
        if (currentDistance >= -10){
            window.clearInterval(id);
            toolbar.setAttribute("style", "bottom:" + 0 + "px");
            
            
        }else{
            move = updateFlow(framekeeper.frame, vel, accl);
            currentDistance += move;
            framekeeper.frame++;
            toolbar.setAttribute("style", "transform:translateY("+ (Math.round(currentDistance)) +"px)");
        }
        
    }, 17);
}
function updateFlow(frame, vel, accl){//calculates pixels for animation (30fps)
    
    var time = frame*(1/60);
    return (vel*time - 0.5*accl*time*time);
}

//aight now some actual functionality

//Color mixer
var redVal = document.getElementById("redVal");
var greenVal = document.getElementById("greenVal");
var blueVal = document.getElementById("blueVal");
var scaleVal = {value: "nah",
                tint: true,
                hsl: "hsl(0, 25%, 100%)"};
var storeColor = {bgcolor: "rgb(0, 0, 0);"};
var colorObj = [0, 0, 0];

redVal.onkeyup =  function(){
    if (redVal.value > 255)
        redVal.value = 255;
    else if (redVal.value < 0)
        redVal.value = 0;
    colorObj[0] = redVal.value;
    update();
}
greenVal.onkeyup =  function(){
    if (greenVal.value > 255)
        greenVal.value = 255;
    else if (greenVal.value < 0)
        greenVal.value = 0;
    colorObj[1] = greenVal.value;
    update();
}
blueVal.onkeyup =  function(){
    if (blueVal.value > 255)
        blueVal.value = 255;
    else if ( blueVal.value < 0)
        blueVal.value = 0;
    colorObj[2] = blueVal.value;
    update();
}

function update(){
    if (redVal.value != "")
        colorObj[0] = redVal.value;
    if (greenVal.value != "")
        colorObj[1] = greenVal.value;
    if (blueVal.value != "")
        colorObj[2] = blueVal.value;
    if (scaleVal.value != "nah" && currentObj.tint){
        let temp = extractRgb(storeColor.bgcolor);
        temp = rgbToHsl(temp[0], temp[1], temp[2]);
        document.getElementById("customorb").setAttribute("style", "background-color: hsl(" + Math.round(temp[0]) + "," + Math.round(temp[1]*100) + "%," + scaleVal.value + "%);");
        currentObj.hsl = "hsl(" + Math.round(temp[0]) + "," + Math.round(temp[1]*100) + "%," + scaleVal.value + "%)";
    }else{
        document.getElementById("customorb").setAttribute("style", "background-color: rgb("+colorObj[0] + "," + colorObj[1] + "," + colorObj[2] + ");");
        storeColor.bgcolor = "rgb("+colorObj[0] + "," + colorObj[1] + "," + colorObj[2] + ");";
    }
    
}

//animate slider (i could not do this all myself unfortunatley) STILL MADE IT VERSATILE THO
window.onload = addListeners;

function addListeners(){
    document.getElementById('slideHandle').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    fixpscreen();

}

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
    document.getElementById("hexoutput").innerHTML = rgbToHex(document.getElementById("customorb").style.backgroundColor);
}   //line above adds hex value using function below

function extractRgb(rgbString){
    var nums = [0, 0, 0];
    var buildNum = "";
    var iterate = 0;
    for(let i = 0; i < rgbString.length; i++){
        let currentChar = rgbString.substring(i, i+1);
        if (Number(currentChar) || Number(currentChar) == 0)
            buildNum += rgbString.substring(i, i+1);
        else if (buildNum != "" && !Number(currentChar)){
            nums[iterate] = Number(buildNum);
            iterate++;
            buildNum = "";
        }
    }
    return nums;
}

//again thankyou to stackoverflow gods for this function below
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = (max - min);
        s = l >= 0.5 ? d / (2 - (max + min)) : d / (max + min);
        switch(max){
            case r: h = ((g - b) / d + 0)*60; break;
            case g: h = ((b - r) / d + 2)*60; break;
            case b: h = ((r - g) / d + 4)*60; break;
        }
    }

    return [h, s, l];
}


function rgbToHex(rgbString){
    var nums = [0, 0, 0];
    var buildNum = "";
    var iterate = 0;
    for(let i = 0; i < rgbString.length; i++){
        let currentChar = rgbString.substring(i, i+1);
        if (Number(currentChar) || Number(currentChar) == 0)
            buildNum += rgbString.substring(i, i+1);
        else if (buildNum != "" && !Number(currentChar)){
            nums[iterate] = Number(buildNum);
            iterate++;
            buildNum = "";
        }
    }
    
    nums.forEach(function(item, index, array){return item < 16 ? array[index] = "0" + item.toString(16).toUpperCase() : array[index] = item.toString(16).toUpperCase();});
    
    return "#" + nums[0] + nums[1] + nums[2];
}

function mouseDown(){
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
    var div = document.getElementById('slideHandle');
    div.style.position = 'absolute';
    if (e.clientY - window.innerHeight + 125 >= 100 || e.clientY - window.innerHeight + 125 <= 0)
        ;//do nothing (aka out of bounds)
    else{
        div.style.top = e.clientY - window.innerHeight + 125 + 70 + 'px';
        if (currentObj.tint)
            currentObj.value = Math.round(100*((e.clientY - window.innerHeight + 125)/100));
        else
            currentObj.value = Math.round((e.clientY - window.innerHeight + 125)*2.55);
        update();
    }
    //console.log(e.clientY - window.innerHeight + 125 + " " + e.clientY);
}


//use slider
var slinkey = false;
var currentObj = {};

var slink = document.getElementById("slink");
var redOrb = document.getElementById("redorb");
var blueOrb = document.getElementById("blueorb");
var greenOrb = document.getElementById("greenorb");
var customOrb = document.getElementById("customorb");

redOrb.onclick = function(){
    currentObj = redVal;
}
greenOrb.onclick = function(){
    currentObj = greenVal;
}
blueOrb.onclick = function(){
    currentObj = blueVal;
}
customOrb.onclick = function(){
    currentObj = scaleVal;
    currentObj.hsl = "rgb("+colorObj[0] + "," + colorObj[1] + "," + colorObj[2] + ")";
}
slink.onclick = function(){
    slinkey = !slinkey;
}

//paintdascreen! (made this after understanding the previous slidercode)
var pscreen = document.getElementById("paintscreen");
var  brushSize = 20;

pscreen.addEventListener('wheel', function(){
  if (window.event.deltaY < 0){
    brushSize++;
  }else if (window.event.deltaY > 0 || brushSize > 0){
    brushSize--; 
  }
});

function fixpscreen(){
  pscreen.height = Math.round(document.documentElement.scrollHeight) - 40;
  pscreen.width = Math.round(document.body.scrollWidth);
  pscreen.addEventListener("mousedown", drawDown, true);
  window.addEventListener("mouseup", drawUp, true);
}

function drawDown(){
  pscreen.addEventListener("mousemove", drawScreen, true);
}

function drawUp(){
  pscreen.removeEventListener("mousemove", drawScreen, true);
}

function drawScreen(){
  var screenContext = pscreen.getContext("2d");
  screenContext.beginPath();
  screenContext.arc(window.event.clientX - 5, window.event.clientY - 20, brushSize, 0, 2*Math.PI);
  if (slinkey){
    if (currentObj == scaleVal)
      screenContext.strokeStyle = currentObj.hsl;
    else if (currentObj == redVal)
      screenContext.strokeStyle = rgbToHex("rgb(" + 255 + "," + 0 + "," + 0 + ");");
    else if (currentObj == greenVal)
      screenContext.strokeStyle = rgbToHex("rgb(" + 0 + "," + 255 + "," + 0 + ");");
    else if (currentObj == blueVal)
      screenContext.strokeStyle = rgbToHex("rgb(" + 0 + "," + 0 + "," + 255 + ");");
    else
      screenContext.strokeStyle = "black";
    screenContext.stroke();
  }else{
    if (currentObj == scaleVal)
      screenContext.fillStyle = currentObj.hsl;
    else if (currentObj == redVal)
      screenContext.fillStyle = rgbToHex("rgb(" + 255 + "," + 0 + "," + 0 + ");");
    else if (currentObj == greenVal)
      screenContext.fillStyle = rgbToHex("rgb(" + 0 + "," + 255 + "," + 0 + ");");
    else if (currentObj == blueVal)
      screenContext.fillStyle = rgbToHex("rgb(" + 0 + "," + 0 + "," + 255 + ");");
    else
      screenContext.fillStyle = "black";
    screenContext.fill();
  }
}



