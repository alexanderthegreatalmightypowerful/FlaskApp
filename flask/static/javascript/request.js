function send_request(command = '', func = '', rfunc = null) { 
    var value = command;
    const url = `http://127.0.0.1:5000/${func}`; 
    var mode = 'POST'; 
    var data = {'data' : value};
  
      $.ajax({
            url: url,
            method: mode,
            dataType : 'json',
            data: JSON.stringify(data),
            crossDomain: false,
            mode : 'no-cors',
            dataType : 'json',
          }).done(function (data) {
            try{
              rfunc(data);
            }catch(e){
              console.alert(e);
            }
          
          }).fail(function (error) {
            alert(error);
          });
  
  }