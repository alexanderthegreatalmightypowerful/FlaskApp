/*Top Bar anaimtion */


var hovering = false;

//Creates a mouse listner so the top bar detects a un-mouse hover
document.getElementById('navbar').addEventListener('mouseout', function() {
if (hovering == true){
    document.getElementById('navbar_animation').style.animation = 'fade_out 1.5s forwards';
}
hovering = false;
}); 

//Creates a mouse listner so the top bar detects a mouse hover
document.getElementById('navbar').addEventListener('mouseover', function() {
if (hovering == false){
    document.getElementById('navbar_animation').style.animation = 'fade_in 1.5s forwards';
}
hovering = true;

}); 
