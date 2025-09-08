

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

function make_data_table(data){
  if(data['failed'] == true){
    console.log("OH NO! I Can't seem to find what you're looking for!");
    return;
  }

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

  make_buttons(data);

}




function get_sql_data(data = ""){
  send_request(data, 'get_sql_data', make_data_table);
}

function search_name(){
  name1 = document.getElementById('search').value;
  if(name1 == ''){
    get_sql_data("Select rank, USERNAME, hits From UserData ORDER BY rank ASC;");
    return;
  }
  get_sql_data(`Select rank, USERNAME, hits FROM UserData WHERE USERNAME == "${name1}";`);
}

function search(ele){
    if(event.key === 'Enter') {
        search_name();       
    }
}


