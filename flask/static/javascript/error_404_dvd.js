//make sad face bounce around scrren like the dvd icon on a tv
var ClickCounter = 0;
var bossfight_started = false;
var stage = 'start';
var boss = null;

var x_speed = 0.1;
var y_speed = 0.2;

const stages = {0 : "start", 5 : 'awake', 10 : 'confused', 15 : "angry", 20 : 'mad',
                25 : "furious", 30 : 'empty', 35 : 'villian', 40 : "god"
}

const stage_speeds = {"start" : [0.1, 0.2] , 'awake' : [0.12, 0.23] , 
                    'confused' : [0.15, 0.26] , "angry" : [0.18, 0.3], 
                    'mad' : [0.25, 0.31], 'furious' : [0.25, 0.31], 'empty' : [0.25, 0.31],
                    'villian' : [0.25, 0.31], 'god' : [0.25, 0.31]}

const stage_images = {'start' : '1', 'awake' : '2', 'confused' : '3', 
                    'angry' : '4', 'mad' : '5', 'furious' : '6', 'empty' : '7',
                    'villian' : '8', 'god' : '9'}

function bounce(){
    var colors = ['(255, 0, 0)', '(0, 255, 0)', '(0, 0, 255)'];
    const el = document.getElementById('sadface');
    boss = el;
    var x = 0;
    var y = 0;

    setInterval(() => {
        var hit = false;
        x += x_speed;
        y += y_speed;
        el.style.left = `${x}%`;
        el.style.bottom = `${y}%`;
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

function bossclicked(){
    ClickCounter += 1;
    if(ClickCounter == 5 &&  bossfight_started == false){
        bossfight_started = true;
        document.getElementById('404_reader').innerText = 'STOP!';
    setTimeout(() => {bounce()},100);
    stage = 'awake';
    }

    console.log(`BOSS CLICKED ${ClickCounter} Times!`);

    if(stage == 'start'){
        return;
    }

    if(stages.hasOwnProperty(ClickCounter) == true){
        console.log('NEW STAGE HAS BEGUN');
        stage = stages[ClickCounter];
        x_speed = stage_speeds[stage][0];
        y_speed = stage_speeds[stage][1];
        facestages();
    }
}

