var held_keys = {'w' : 0, 's' : 0, 'a' : 0, 'd' : 0};
var timed_keys = {};
var coords = {0 : 0, 1 : 0};
var speed = 6;
var dead = false;

var inv = false;

var player_max_hp = 6;
var player_hp = 6;

var tutorial_movement = {'w' : false, 'a' : false, 's' : false, 'd' : false}
var move_tutorial_state = true;

var player = document.getElementById('player');
var mouse_player = document.getElementById('mouse');

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
        tutorial_movement['w'] = true;
        player.style.rotate = '90deg';
    }
    else if(coord[1] == -1){
        tutorial_movement['s'] = true;
        player.style.rotate = '270deg';
    }
    else if(coord[0] == 1){
        tutorial_movement['d'] = true;
        player.style.rotate = '180deg';
    }
    else if(coord[0] == -1){
        tutorial_movement['a'] = true;
        player.style.rotate = '0deg';
    }

    if((coord[0] != 0 || coord[1] != 0) && move_tutorial_state == true){
    let w = '<span style="color: grey;">W</span>';
    if(tutorial_movement['w'] == true){
        w = '<span style="color: green;">W</span>';
    }

    let a = '<span style="color: grey;">A</span>';
    if(tutorial_movement['a'] == true){
        a = '<span style="color: green;">A</span>';
    }

    let s = '<span style="color: grey;">S</span>';
    if(tutorial_movement['s'] == true){
        s = '<span style="color: green;">S</span>';
    }

    let d = '<span style="color: grey;">D</span>';
    if(tutorial_movement['d'] == true){
        d = '<span style="color: green;">D</span>';
    }

    var el = document.getElementById('tutorial_text');
    el.innerHTML = `${w}${a}${s}${d}`;
    }

    if(tutorial_movement['w'] == true && tutorial_movement['a'] == true && tutorial_movement['s'] == true && tutorial_movement['d'] == true && move_tutorial_state == true){
        move_tutorial_state = false;
        tutorial_stage += 1;
        hide_show_tutorial(false);
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

function take_damage(damage = 0){
    if(inv == true){
        return;
    }
    console.log("PLAYER TOOK DAMAGE!");
    player_hp += damage;
    if(player_hp <= 0){
        player.style.backgroundColor = `rgb(${0}, ${0}, 0)`;
        document.getElementById('DIED_TEXT').style.visibility = 'visible';
        dead = true;
        player_dead = true;
        return;
    }

    var hp = (player_hp / player_max_hp) * 255;
    var counter = 255 - hp;
    console.log(hp);
    player.style.backgroundColor = `rgb(${counter}, ${Math.trunc(hp)}, 0)`;
}

var damage_inverval = 0;

setInterval(() => {
    if(player_dead == true || game_paused == true){
        return;
    }

    move([held_keys['d'] - held_keys['a'], held_keys['w'] - held_keys['s']]);

    if(live_rocks != undefined)
    {

    damage_inverval += 10;

    //console.log(damage_inverval);

    if(boss != null){
        var calc = [coords[0] - parseInt(boss.style.left), coords[1] - parseInt(boss.style.bottom)];
        var dist = Math.sqrt(calc[0] ** 2 + calc[1] ** 2);
        if(dist <= 200){
            //console.log('DISTANCE:', dist);
            if(damage_inverval >= 1000){
                take_damage(-1);
                damage_inverval = 0;
            }
        }
    }

    for(let i = 0; i < live_rocks.length; i++){
        var r = live_rocks[i];
        if(r == undefined){
            continue;
        }
        var calc = [coords[0] - r.x, coords[1] - r.y];
        var dist = Math.sqrt(calc[0] ** 2 + calc[1] ** 2);
        if(dist <= 60){
            console.log('DISTANCE:', dist);
            destroy_rock(r);
            if(damage_inverval >= 1000){
                take_damage(-1);
                damage_inverval = 0;
            }
            break;
        }
    };

    }

}, 10)



function mousepos(p){
    mouse_player.style.left = `${p.pageX - 23}px`;
    mouse_player.style.top = `${p.pageY - 26}px`;
}

addEventListener('mousemove', mousepos, false);




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