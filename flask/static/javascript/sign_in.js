
function do_account_stuff(data){//checks return data validity
    console.log(data);
    if(data['result'] == true){//success
        window.sessionStorage.setItem('username', data['username']);
        go_to_home_page();
    }else{//display error if ther was a failure
        console.log('ERROR, THE PASSWORD OR USERNAME IS INCORRECT');
        console.log(data['message']);
        document.getElementById('error_message').style.visibility = 'visible';
        document.getElementById('error_message').innerText = data['message'].toString();
    }
}

function sign_in(){ //on click sign in function
    console.log('signing in!');
    var username = document.getElementById('username');
    var password = document.getElementById('password');
    //send sign in request with inputed info
    send_request(
        {'username' : username.value, 
        'password' : password.value}
        ,'sign_in', do_account_stuff);
}