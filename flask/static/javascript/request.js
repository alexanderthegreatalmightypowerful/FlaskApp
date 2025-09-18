/*
This function is what communicates with the backend
*/

function send_request(command = '', func = '', rfunc = null, bfunc = null) { 
    var value = command;
    const url = `/${func}`;
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
              if(rfunc != null){ //if we specified a success return function, call
              rfunc(data);
              }
            }catch(e){
              console.assert(e);
            }
          
          }).fail(function (error){
            alert(error);
            if(bfunc != null){//if we specified a failed return function, call
              bfunc();
            }
          });
  
  }