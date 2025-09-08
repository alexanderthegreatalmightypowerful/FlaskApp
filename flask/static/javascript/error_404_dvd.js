//make sad face bounce around scrren like the dvd icon on a tv
var ClickCounter = 0;
var bossfight_started = false;
var stage = 'start';
var boss = null;

var x_speed = 0.1;
var y_speed = 0.2;

var tutorial_stage = 0;

var game_paused = false;

var player_dead = false;

var rotation_speed = 0;
var boss_rotation = 0;

var send_missiles = false;
var missile_time = 4;

var upgrading_boss = false;

var before_click = 0

const flip = (data) => Object.fromEntries(
    Object
      .entries(data)
      .map(([key, value]) => [value, key])
    );

const stages = {0 : "start", 5 : 'awake', 10 : 'confused', 15 : "angry", 20 : 'mad',
                25 : "furious", 30 : 'empty', 35 : 'villian', 40 : "god", 45 : 'dead'
}

const stagesr = flip(stages);

const stage_speeds = {"start" : [40, 30, 0, 'awake'] , 'awake' : [1, 1, 0, 'confused'] , 
                    'confused' : [1.8, 1.8, 1, 'angry'] , "angry" : [2.4, 2.4, 1.5, 'mad'], 
                    'mad' : [3, 3, 2.2, 'furious'], 'furious' : [3.5, 3.5, 2.8, 'empty'], 'empty' : [4, 4, 4, 'villian'],
                    'villian' : [4.3, 4.3, 5, 'god'], 'god' : [5, 5, 12, 'dead'], 'dead' : [0, 0, 12, 'dead']}

const stage_images = {'start' : '1', 'awake' : '2', 'confused' : '3', 
                    'angry' : '4', 'mad' : '5', 'furious' : '6', 'empty' : '7',
                    'villian' : '8', 'god' : '9', 'dead' : '10'}


var boss_hp = 5;

function hide_show_tutorial(value = false, text = ""){
    let el = document.getElementById('tutorial_bg');
    if(value == false){
       el.style.width = '0px';
       el.style.visibility = 'hidden';
    }else{
      el.style.width = '100%';
       el.style.visibility = 'visible';
       document.getElementById('tutorial_text').innerText = text;
    }
}


function boss_upgrade(){
    if(boss == null){
        boss = document.getElementById('sadface');
    }

    
    if(tutorial_stage == 1){
        setTimeout(() => {game_paused = true; hide_show_tutorial(true, "AVOID THE BOSS!")}, 3000);
        setTimeout(() => {game_paused = false; hide_show_tutorial(false); tutorial_stage += 1}, 8000);
    }

    upgrading_boss = true;
    //boss.style.animation = 'boss_upgrade_animation 0.8s';
    boss.classList.add('boss_animation_class');
    setTimeout(() => {upgrading_boss=false;facestages();}, 900);
    send_request({'hits' : ClickCounter-before_click}, 'get_clicks', null);
    before_click = ClickCounter;

    if(tutorial_stage == 4){
        setTimeout(() => {game_paused = true; hide_show_tutorial(true, "The boss upgrades over time. It will get harder from here")}, 1000);
        setTimeout(() => {game_paused = false; hide_show_tutorial(false); tutorial_stage += 1}, 4000);
    }
}

function bounce(){
    var colors = ['(255, 0, 0)', '(0, 255, 0)', '(0, 0, 255)'];
    const el = document.getElementById('sadface');
    boss = el;
    var x = 0;
    var y = 0;

    var missile_timer = 0;

    setInterval(() => {
        if(player_dead == true || game_paused == true){
        return;
        }
        if(upgrading_boss == true){
            return;
        }

        if(send_missiles == true){
            missile_timer += 0.01;
            if(missile_timer >= missile_time){
                missile_timer = 0;
                send_missile(pos = [x, y]);
            }
        }

        var hit = false;
        x += x_speed;
        y += y_speed;
        el.style.left = `${x}px`;
        el.style.bottom = `${y}px`;
        boss_rotation += rotation_speed;
        boss.style.rotate = `${boss_rotation}deg`;

        if(x >= window.innerWidth-200){
            x_speed = Math.abs(x_speed) * -1;
            //console.log('its abouve x');
            hit = true;
        }
        if(y >= window.innerHeight - 200){
            y_speed = Math.abs(y_speed) * -1;
            //console.log('its abouve y');
            hit = true;
        }

        if(x <= 0){
            x_speed = Math.abs(x_speed);
            //console.log('its below x');
            hit = true;
        }
        if(y <= 0){
            y_speed = Math.abs(y_speed);
            //console.log('its below y');
            hit = true;
        }

        if(hit == true){
            el.style.color = `rgb${colors[0]}`;
            var popped = colors[0];
            colors.splice(0, 1);
            colors.push(popped);
        }
    }, 10);
}

function facestages(){
    var title = document.getElementById('404_reader');

    if(boss == null){
        boss = document.getElementById('sadface');
    }
    
    boss.style.backgroundImage = `url("../static/images/faces/${stage_images[stage]}.png")`;

    title.innerText = `BOSS IS: ${stage.toUpperCase()}`;

}

function lower_boss_bar(hp_bar){
    var hp = (boss_hp / (parseInt(stagesr[stage_speeds[stage][3]]) - parseInt(stagesr[stage]))) * 100;
    //console.log(hp, stagesr);
    hp_bar.style.width = `${hp}%`;
    hp_bar.style.backgroundColor = `rgb(${255}, ${hp * 2.55}, 0.0)`;

}

function bossclicked(){
    if(player_dead == true || game_paused == true){
        return;
    }
    ClickCounter += 1;
    boss_hp -= 1;

    boss = document.getElementById('sadface');
    boss.style.backgroundColor = 'rgb(216, 161, 161)';
    setTimeout(() => {boss.style.backgroundColor = 'rgb(255, 255, 255)';}, 50);

    if(ClickCounter == 1){
        document.getElementById('404_reader').innerText = 'Uhm...';
    }
    else if(ClickCounter == 2){
        document.getElementById('404_reader').innerText = "Don't";
    }
    else if(ClickCounter == 3){
        document.getElementById('404_reader').innerText = "Just";
    }
    else if(ClickCounter == 4){
        document.getElementById('404_reader').innerText = "Don't";
    }

    if(ClickCounter == 5 &&  bossfight_started == false){
        bossfight_started = true;
        document.getElementById('404_reader').innerText = 'STOP!';
    setTimeout(() => {bounce()},100);
    stage = 'awake';
    }

    //console.log(`BOSS CLICKED ${ClickCounter} Times!`);

    var hp_bar = document.getElementById('boss_bar').children[0];

    lower_boss_bar(hp_bar);

    if(stage == 'start'){
        return;
    }

    if(tutorial_stage > 2){
    ro = new rock();
    ro.body.style.backgroundImage = `url('../static/images/faces/${stage_images[stage]}.png')`;
    }

    if(tutorial_stage == 2){
        setTimeout(() => {game_paused = true; hide_show_tutorial(true, "WATCH OUT, MINIONS SPAWN WHEN YOU HIT THE BOSS!")}, 1000);
        setTimeout(() => {game_paused = false; hide_show_tutorial(false); tutorial_stage += 1}, 5000);
    }

    if(stages.hasOwnProperty(ClickCounter) == true){
        missiles_enabled = true;
        console.log('NEW STAGE HAS BEGUN');
        stage = stages[ClickCounter];
        boss_hp = (parseInt(stagesr[stage_speeds[stage][3]]) - parseInt(stagesr[stage]));//stage_speeds[stage][3];

        lower_boss_bar(hp_bar);

        hp_bar.style.width = "100%";

        send_missiles = true;


        x_speed = stage_speeds[stage][0] * (x_speed / Math.abs(x_speed));
        y_speed = stage_speeds[stage][1] * (y_speed / Math.abs(y_speed));


        rotation_speed = stage_speeds[stage][2];

        if(boss == null){
            boss = document.getElementById('sadface');
        }

        boss.classList.remove('boss_animation_class');
        setTimeout(()=>{
            boss_upgrade();
        }, 100);
        
    }
}

function skip_tutorial(){
    tutorial_stage = 100;
}


//<span style="color: blue;">blue text</span>

