function do_account_stuff(data){
    console.log(data);
    if(data['result'] == 'success'){
        window.sessionStorage.setItem('username', data['username']);
        go_to_home_page();
    }
}

function sign_in(){
    console.log('signing in!');
    var username = document.getElementById('username');
    var password = document.getElementById('password');
    send_request(
        {'username' : username.value, 
        'password' : password.value}
        ,'sign_in', do_account_stuff);
}