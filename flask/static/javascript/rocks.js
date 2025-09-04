rock_id_counter = 0;
live_rocks = [];


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class rock{
    counter = 0;
    constructor(){
        //super();
        this.damage = 10;

        if(getRandomInt(0, 1) == 0){
            this.x = -100 + (getRandomInt(0, 1) * 2000);
            this.y = getRandomInt(0, 1000);
            this.direction = [1, 0];
        }else{
            this.x = getRandomInt(0, 1000);
            this.y = -100 + (getRandomInt(0, 1) * 2000); 
            this.direction = [0, 1];
        }

        this.size = getRandomInt(10, 100);

        this.speed = getRandomInt(1, 4) * (-this.x / Math.abs(this.x));
        
        this.id = rock_id_counter;
        this.alive = true;
        this.rot = 0;

        rock_id_counter += 1;

        this.body = document.createElement('button');
        this.body.classList.add('rock');
        this.body.style.width = `${this.size}px`;
        this.body.style.height = `${this.size}px`;
        this.body.id = `rock_${this.id}`;
        document.body.append(this.body);
        live_rocks.push(this);
        console.log("created new ROCK with id: ",this.id, live_rocks);
        this.body.style.bottom = `${this.y}px`;
    }
}

function destroy_rock(m){
    m.speed = 0;
    m.body.remove();
    m.alive = false;
}

function rock_update_loop(){
    for(let i = 0; i < live_rocks.length; i++) {
        var m = live_rocks[i];
        if(m.alive == false){
            continue;
        }
       
        m.x += m.speed * m.direction[0];
        m.y += m.speed * m.direction[1];

        m.rot += m.speed;

        m.body.style.left = `${m.x}px`;
        m.body.style.bottom = `${m.y}px`;
        m.body.style.rotate = `${m.rot}deg`;

        //console.log(m);
        
    }

}

setInterval(() => {
    if(player_dead == true || game_paused == true){
        return;
    }
    var new_rock_list = [];
    for(let i = 0; i < live_rocks.length; i++){
        if(live_rocks[i].alive == true){
            new_rock_list.push(live_rocks[i]);
        }else{
            destroy_rock(live_rocks[i]);
        }
    }
    live_rocks = new_rock_list;
    rock_update_loop();
},
 10)