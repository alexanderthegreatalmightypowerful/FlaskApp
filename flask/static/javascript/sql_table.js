var total_string = '';
var select_all = true;


function make_data_table(data){
  var table = document.getElementById('data_table');
  var table_data = data;

  var tables = {};
  var table_data_holder = [];
  var data_string = '<tr>';
  for(var column in data['columns']){
    data_string += '<th>' + data['columns'][column] + '</th>';
    tables[data['columns'][column]] = [];
    //console.log(data['columns'][column]);
  }
  data_string += '</tr>';
  //console.log(data['data']);
  
  for(var item in data['rows']){
    data_string += '<tr>';
    for(value in data['rows'][item]){
      data_string += "<td>" + data['rows'][item][value] +"</td>";
      //console.log(data['rows'][item][value]);
    }
    data_string += '</tr>';
  }
  
  data_string = data_string + '</tr>'
  //console.log(data_string);

  table.innerHTML = data_string;

}

function make_buttons(data){
  //buttons_array
  var buttons_data = data['tables'];
  var div = document.getElementById('buttons_array');
  div.innerHTML = "";

  for(const [key, value] of Object.entries(buttons_data)){
    console.log("Making new table:",key);
    var new_div = document.createElement('div');
    new_div.classList.add('sql_table_div');
    div.append(new_div);

    var title = document.createElement('h1');
    title.innerText = key;
    new_div.append(title);

    value.forEach(function (item, index) {
      var button = document.createElement('button');
      button.classList.add("sql_option_button");
      button.innerText = item;
      new_div.append(button);
    });
  }
  
}

function sendData() { 
  var value = 'Select * FROM Languages';
  const url = 'http://127.0.0.1:5000/request_database_data'; 
  var mode = 'POST'; 
  var data = {'data' : value};

    $.ajax({
          url: url,
          method: mode,
          data: data,
          crossDomain: false,
          mode : 'no-cors',
          dataType : 'json',
        }).done(function (data) {
          //console.log(data['columns']);
          //console.log(data['data']);
          make_data_table(data);
          make_buttons(data);
        
        }).fail(function (error) {
          alert(error);
        });

}

setTimeout(() => {
  sendData();
}, 1000)
