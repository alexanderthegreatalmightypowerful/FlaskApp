function do_account(data){
    console.log(data);
    if(data['result'] == 'success'){
        window.sessionStorage.setItem('username', data['username']);
        go_to_home_page();
    }
}


function create_new_account(){
    var username = document.getElementById('username');
    var password = document.getElementById('username');
    send_request(
        {'username' : username.value, 
        'password' : password.value}
        ,'create_new_account', do_account);
}


function sign_out(){
    window.sessionStorage.setItem('username', undefined); //Doesnt work sometimes
    window.sessionStorage.clear();
    location.reload()
}