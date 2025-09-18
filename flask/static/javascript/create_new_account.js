/* Backend connection to request new account creation*/

function do_account(data){
    //checks to see if the account was created
    //if there was an error, show the error here
    console.log(data);
    if(data['result'] == true){
        window.sessionStorage.setItem('username', data['username']);
        go_to_home_page();
    }else{
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        //username.value = "";
        password.value = "";
        //console.log(data['message']);
        document.getElementById('error_message').style.visibility = 'visible';
        document.getElementById('error_message').innerText = data['message'].toString();
    }
}

function create_new_account(){
    //sends account creation request
    var username = document.getElementById('username');
    var password = document.getElementById('password');
    send_request(
        {'username' : username.value, 
        'password' : password.value}
        ,'create_new_account', do_account);
}

function reload_page(){
    location.reload();
}

function sign_out(){
    window.sessionStorage.setItem('username', undefined); //Doesnt work sometimes
    window.sessionStorage.clear();
    send_request({'sign_out' : "lol"}, 'sign_out', reload_page);
    //location.reload();
}