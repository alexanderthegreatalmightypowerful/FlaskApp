function do_account_stuff(data){
    console.log(data);
    if(data['result'] == true){
        window.sessionStorage.setItem('username', data['username']);
        go_to_home_page();
    }else{
        console.log('ERROR, THE PASSWORD OR USERNAME IS INCORRECT');
        console.log(data['message']);
        document.getElementById('error_message').style.visibility = 'visible';
        document.getElementById('error_message').innerText = data['message'].toString();
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