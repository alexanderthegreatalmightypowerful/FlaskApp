function set_profile(data){
    console.log(data)
    document.getElementById('profile_pic').style.backgroundImage = `url('static/images/profiles/${data['picture']}.png')`;
}


if(window.sessionStorage.getItem('username') != undefined){
    console.log('USERNAME: ',window.sessionStorage.getItem('username'))
    document.getElementById('account_name').innerText = window.sessionStorage.getItem('username');
    document.getElementById('create_account').style.width = '0px';
    document.getElementById('sign_in').style.width = '0px';
    document.getElementById('create_account').remove()
    document.getElementById('sign_in').remove()
    send_request('get_profile_data', 'get_profile_data', set_profile);
}else{
    document.getElementById('sign_out').style.width = '0px';
    document.getElementById('sign_out').remove()
    //document.getElementById('profile_pic').style.backgroundImage = "url('static/images/profiles/missing.png')";
    document.getElementById('profile_pic').remove();
    document.getElementById('account_name').remove();
    document.getElementById('account_id').remove();
    document.getElementById('persinal_stats').remove();
}