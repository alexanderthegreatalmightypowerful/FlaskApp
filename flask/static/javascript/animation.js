var hovering = false;


document.getElementById('navbar').addEventListener('mouseout', function() {
//document.getElementById('navbar_animation').style.visibility = 'hidden';
if (hovering == true){
    document.getElementById('navbar_animation').style.animation = 'fade_out 1.5s forwards';
}
hovering = false;
}); 

document.getElementById('navbar').addEventListener('mouseover', function() {
//document.getElementById('navbar_animation').style.visibility = 'visible';
if (hovering == false){
    document.getElementById('navbar_animation').style.animation = 'fade_in 1.5s forwards';
}
hovering = true;

}); 
