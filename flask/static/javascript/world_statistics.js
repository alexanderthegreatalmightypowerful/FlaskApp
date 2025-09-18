/*
Recieves
*/

var total_string = '';
var select_all = true;
var clicked_medals_buttons = [];
var clicked_achievements_buttons = [];

var hits_range = [0, 999999999];
var medal_data = {0 : false, 1 : false, 2:false, 3:false, 4:false, 
  5:false, 6:false, 7:false, 8:false, 9:false,10:false, 11:false
};

var achievements_data = {'Loser' : false, 'Noob' : false, 'Starter' : false}

function receive_searches(data){
  console.log(data);
  make_data_table(data);
}

function search_for(){
  let medals2 = [];
    for (const [key, value] of Object.entries(medal_data)) {
        if(value == true){
          medals2.push(key);
        }
    }

    let ach2 = [];
    for (const [key, value] of Object.entries(achievements_data)) {
        if(value == true){
          ach2.push(key);
        }
    }

  send_request({'medals' : medals2, 'achievements' : ach2, 'hits' : hits_range}, 'world_statistics_data_custom', receive_searches);
}

setTimeout(() => {
  //sendData();
  search_for();
}, 10)

function select_button(button, type, id){
  if(clicked_medals_buttons.includes(button) && type == 'medal'){
    medal_data[id] = false;
    clicked_medals_buttons.pop(clicked_medals_buttons.indexOf(button));
    document.getElementById(button).style.borderColor = "var(--border_gray_color)";
  }else if(!clicked_medals_buttons.includes(button) && type == 'medal'){
    medal_data[id] = true;
    clicked_medals_buttons.push(button);
    document.getElementById(button).style.borderColor = "var(--border_color)";
  }

  if(clicked_achievements_buttons.includes(button) && type == 'achievement'){
    achievements_data[id] = false;
    clicked_achievements_buttons.pop(clicked_achievements_buttons.indexOf(button));
    document.getElementById(button).style.borderColor = "var(--border_gray_color)";
  }else if(!clicked_medals_buttons.includes(button) && type == 'achievement'){
    achievements_data[id] = true;
    clicked_achievements_buttons.push(button);
    document.getElementById(button).style.borderColor = "var(--border_color)";
  }
}

function update_slider(value, name){
  document.getElementById(name).innerText = `${value}`;
  if(name == 'min'){
    hits_range = [value, hits_range[1]];
  }else{
    hits_range = [hits_range[0], value];
  }
  let el = document.getElementById('maxs');
  let el2 = document.getElementById('mins');
  if(el.value < el2.value){
    el.value = el2.value + 1;
  }
  if(el2.value > el.value){
    el2.value = el.value - 1;
  }
  console.log(value);
}

function set_hits(data){
  console.log(data);
  let el = document.getElementById('maxs');
  let el2 = document.getElementById('mins');
  el.max = data['hits'];
  el2.max = data['hits'];
  el.value = data['hits'];
  document.getElementById('max').innerText = `${data['hits']}`;
}

setTimeout(() => {
  send_request('get_data', 'world_statistics_data', set_hits);
}, 100)