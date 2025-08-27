var menu_enabled = false;

function open_profile_choose_menu(){
    let b = document.getElementById("choose_profiles_div");
    b.style.animation = "choose_profiles_div_in 0.7s forwards";
    menu_enabled = true;
}

function close_profile_choose_menu(selection = "")
{
    document.getElementById('profile_pic2').style.backgroundImage = `url('static/images/profiles/${selection}.png')`; 
    document.getElementById('profile_pic').style.backgroundImage = `url('static/images/profiles/${selection}.png')`; 
    send_request({'picture' : selection}, 'set_profile_picture')
    let b = document.getElementById("choose_profiles_div");
    b.style.animation = "choose_profiles_div_out 0.7s forwards";
    menu_enabled = false;
}