

function set_properties(data){
    console.log(data);
}

send_request("get data", 'world_statistics_data', set_properties);

var total_string = '';
var select_all = true;
var clicked_medals_buttons = [];
var clicked_achievements_buttons = [];

var hits_range = [0, 99999];
var medal_data = [];
var achievements_data = []

function receive_searches(data){

}

function search_for(){
  send_request({'medals' : medal_data, 'achievements' : achievements_data}, 'world_statistics_data_custom', receive_searches);
}

function select_button(button, type){
  if(clicked_medals_buttons.includes(button)){
    medal_data.pop(medal_data.indexOf(button));
    clicked_medals_buttons.pop(clicked_medals_buttons.indexOf(button));
    document.getElementById(button).style.borderColor = "var(--border_red_color)";
  }else if(!clicked_medals_buttons.includes(button)){
    medal_data.push(button)
    clicked_medals_buttons.push(button);
    document.getElementById(button).style.borderColor = "var(--border_color)";
  }
}