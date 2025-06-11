function send_request(command = '', func = '', rfunc = null, bfunc = null) { 
    var value = command;
    const url = `/${func}`;  //http://127.0.0.1:5000
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
              if(rfunc != null){
              rfunc(data);
              }
            }catch(e){
              console.assert(e);
            }
          
          }).fail(function (error){
            alert(error);
          });
  
  }