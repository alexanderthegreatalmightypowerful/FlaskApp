function go_to_game_page(){
    var a = document.createElement('a');
    a.href = '404';
    a.click();
}

function go_to_statistics_page(){
    var a = document.createElement('a');
    a.href = 'statistics';
    a.click();
}

function signed_in(value){
    console.log(value);
}

function sign_in(){
    send_request(
                {'username' : 'the chosen one', 
                'password' : 'heheheha'}
                , 'sign_in', signed_in);
}