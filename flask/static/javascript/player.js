var held_keys = {'w' : 0, 's' : 0, 'a' : 0, 'd' : 0};
var timed_keys = {};
var coords = {0 : 0, 1 : 0};
var speed = 6;

var player = document.getElementById('player');

var was_holding = false;

function player_stop_animation(){
    //console.log('doing player animation');
    player.style.rotate = '0deg';
    player.classList.add('stop_player_animation_class');
}

function move(coord = [0, 0]){

    var nspeed = speed;

    if(coord[0] != 0 && coord[1] != 0){
        nspeed = speed / 1.4142;
    }

    if(coord[0] == 1 && coord[1] == 1){
        player.style.rotate = '135deg';
    }
    else if(coord[0] == -1 && coord[1] == 1){
        player.style.rotate = '45deg';
    }
    else if(coord[0] == 1 && coord[1] == -1){
        player.style.rotate = '225deg';
    }
    else if(coord[0] == -1 && coord[1] == -1){
        player.style.rotate = '315deg';
    }

    else if(coord[1] == 1){
        player.style.rotate = '90deg';
    }
    else if(coord[1] == -1){
        player.style.rotate = '270deg';
    }
    else if(coord[0] == 1){
        player.style.rotate = '180deg';
    }
    else if(coord[0] == -1){
        player.style.rotate = '0deg';
    }



    if (coords[0] + coord[0] * speed > 0 && coords[0] + coord[0] * nspeed < window.innerWidth - 50){
        coords[0] += coord[0] * nspeed;
        player.style.left = `${coords[0]}px`;
    }
    if (coords[1] + coord[1] * nspeed > 0 && coords[1] + coord[1] * nspeed < window.innerHeight - 50){
        coords[1] += coord[1] * nspeed;
        player.style.bottom = `${coords[1]}px`;
    }


    if(was_holding == true && coord[0] == 0 && coord[1] == 0){
        was_holding = false;
        player_stop_animation();
        player.classList.remove('move_player_animation_class');
    }

    if(was_holding == false && (coord[0] != 0 || coord[1] != 0)){
        was_holding = true;
        //console.log('holding');
        player.classList.remove('stop_player_animation_class');
        player.classList.add('move_player_animation_class');
    }

}


setInterval(() => {
    move([held_keys['d'] - held_keys['a'], held_keys['w'] - held_keys['s']]);
}, 10)











function init_key_detection(){
    const signalKeypressDuration = (key, duration) => {
        key = key.toLowerCase();
        //console.log(`Key ${key} pressed for ${duration} ms`);
        timed_keys[key] = duration;
      };

      document.body.addEventListener("keydown", ({ key }) => {
        //timed_keys[key] = 0;
        key = key.toLowerCase();
        if (!timed_keys[key]) timed_keys[key] = Date.now();
        try{held_keys[key] = true;
            }catch(e){}
      });

      document.body.addEventListener("keyup", ({ key }) => {
        //console.log(key);
        key = key.toLowerCase();
        signalKeypressDuration(key, Date.now() - timed_keys[key]);
        try{
        held_keys[key] = false;
        }catch(e){}
      });

}

init_key_detection();