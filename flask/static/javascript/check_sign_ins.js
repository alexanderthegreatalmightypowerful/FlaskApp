if(window.sessionStorage.getItem('username') != undefined){
    console.log('USERNAME: ',window.sessionStorage.getItem('username'))
    document.getElementById('account_name').innerText = window.sessionStorage.getItem('username');

    document.getElementById('create_account').style.width = '0px';
    document.getElementById('sign_in').style.width = '0px';
    document.getElementById('create_account').remove()
    document.getElementById('sign_in').remove()

}else{
    document.getElementById('sign_out').style.width = '0px';
    document.getElementById('sign_out').remove()
}