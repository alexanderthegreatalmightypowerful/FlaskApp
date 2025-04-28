//make sad face bounce around scrren like the dvd icon on a tv
var ClickCounter = 0;
var bossfight_started = false;
var stage = 'start';
var boss = null;

var x_speed = 0.1;
var y_speed = 0.2;

var rotation_speed = 0;
var boss_rotation = 0;

var send_missiles = false;
var missile_time = 1;

var upgrading_boss = false;

const flip = (data) => Object.fromEntries(
    Object
      .entries(data)
      .map(([key, value]) => [value, key])
    );
  


const stages = {0 : "start", 5 : 'awake', 10 : 'confused', 15 : "angry", 20 : 'mad',
                25 : "furious", 30 : 'empty', 35 : 'villian', 40 : "god"
}

const stagesr = flip(stages);

const stage_speeds = {"start" : [0.1, 0.2, 0, 'awake'] , 'awake' : [0.12, 0.23, 0, 'confused'] , 
                    'confused' : [0.15, 0.26, 1, 'angry'] , "angry" : [0.18, 0.3, 1.5, 'mad'], 
                    'mad' : [0.25, 0.31, 2.2, 'furious'], 'furious' : [0.25, 0.31, 2.8, 'empty'], 'empty' : [0.25, 0.31, 4],
                    'villian' : [0.25, 0.31, 5, 'god'], 'god' : [0.25, 0.31, 12, 'god']}

const stage_images = {'start' : '1', 'awake' : '2', 'confused' : '3', 
                    'angry' : '4', 'mad' : '5', 'furious' : '6', 'empty' : '7',
                    'villian' : '8', 'god' : '9'}


var boss_hp = 5;

function boss_upgrade(){
    if(boss == null){
        boss = document.getElementById('sadface');
    }

    upgrading_boss = true;
    //boss.style.animation = 'boss_upgrade_animation 0.8s';
    boss.classList.add('boss_animation_class');
    setTimeout(() => {upgrading_boss=false;facestages();}, 900);
}



function send_missile(pos){
    var miss = new missile();
    console.log("BOdy Width:", parseInt(window.innerWidth), parseInt(window.innerHeight));
    miss.x = parseInt(window.innerWidth) * (pos[0] * 0.01);
    miss.y = parseInt(window.innerHeight) * (pos[1] * 0.01);

    console.log(miss.x, miss.y);
    miss.speed = (1 / missile_time) * 4
    miss.lifetime = 5;
}

function bounce(){
    var colors = ['(255, 0, 0)', '(0, 255, 0)', '(0, 0, 255)'];
    const el = document.getElementById('sadface');
    boss = el;
    var x = 0;
    var y = 0;

    var missile_timer = 0;

    setInterval(() => {
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
        el.style.left = `${x}%`;
        el.style.bottom = `${y}%`;
        boss_rotation += rotation_speed;
        boss.style.rotate = `${boss_rotation}deg`;

        if(x >= 85){
            x_speed = Math.abs(x_speed) * -1;
            //console.log('its abouve x');
            hit = true;
        }
        if(y >= 70){
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

    title.innerText = `BOSS IS: ${stage}`;

}

function lower_boss_bar(hp_bar){
    var hp = (boss_hp / (parseInt(stagesr[stage_speeds[stage][3]]) - parseInt(stagesr[stage]))) * 100;
    console.log(hp, stagesr);
    hp_bar.style.width = `${hp}%`;
    hp_bar.style.backgroundColor = `rgb(${255}, ${hp * 2.55}, 0.0)`;

}

function bossclicked(){
    ClickCounter += 1;
    boss_hp -= 1;

    if(ClickCounter == 5 &&  bossfight_started == false){
        bossfight_started = true;
        document.getElementById('404_reader').innerText = 'STOP!';
    setTimeout(() => {bounce()},100);
    stage = 'awake';
    }

    console.log(`BOSS CLICKED ${ClickCounter} Times!`);

    var hp_bar = document.getElementById('boss_bar').children[0];

    lower_boss_bar(hp_bar);

    if(stage == 'start'){
        return;
    }

    if(stages.hasOwnProperty(ClickCounter) == true){
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

