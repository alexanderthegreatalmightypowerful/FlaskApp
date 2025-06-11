
var live_missiles = [];
var mousex = 1;
var mousey = 1;
var step = 10;

var missile_id_counter = 0;

class missile{
    counter = 0;
    constructor(){
        //super();
        this.damage = 10;
        this.x = 500;
        this.y = 0;
        this.speed = 1;
        this.lifetime = 3;
        this.lived = 0;
        this.id = missile_id_counter;
        this.alive = true;

        missile_id_counter += 1;

        this.body = document.createElement('button');
        this.body.classList.add('missile');
        this.body.id = this.id.toString();
        document.body.append(this.body);
        live_missiles.push(this);
        //console.log("created new missile iwth id: ",missile_id_counter, live_missiles);
    }
}

//new missile();

function mousepos(p){
    //console.log('Position X : ' + p.pageX + '<br />Position Y : ' + p.pageY);
    mousex = p.pageX;
    mousey = p.pageY;
}

addEventListener('mousemove', mousepos, false);

function destroy_missile(m){
    m.speed = 0;
    m.body.remove();
}

function update_loop(){
    for(let i = 0; i < live_missiles.length; i++) {
        var m = live_missiles[i];
        if(m.alive == false){
            continue;
        }
        m.lived += step / 1000;
        if(m.lived >= m.lifetime){
            m.alive = false;
            continue;
        }

        var ma = (mousey - m.y) / (mousex - m.x);
        var ma2 = (mousex - m.x) / (mousey - m.y);
        var pythag = Math.sqrt((mousey - m.y) ** 2 + (mousex - m.x) ** 2);
        //console.log(pythag);
        if(pythag < 10){
            m.alive = false;
            continue;
        }

        m.body.innerText = parseInt(m.lifetime - m.lived).toString();

        //console.log(ma == NaN);
        if(ma != NaN && ma != Infinity && ma != -Infinity && ma != null){
            var tan = Math.tanh(ma);
            var tan2 = Math.tanh(ma2);
            var x_move = 1;
            if(mousex < m.x){tan = tan * -1;
                x_move = -1;
            }
            if(mousey < m.y){
                tan2 = tan2 * -1;
            }

            //console.log(tan);
            
            var x = (m.x + (m.speed * tan2));
            var y = (m.y + (m.speed  * tan));
    
            m.x = x;
            m.y = y;
    
            m.body.style.left = `${x}px`;
            m.body.style.top = `${y}px`;
            
        }
    }

}

setInterval(() => {
    var new_missile_list = [];
    for(let i = 0; i < live_missiles.length; i++){
        if(live_missiles[i].alive == true){
            //live_missiles.pop(i);
            new_missile_list.push(live_missiles[i]);
            //console.log('Destroyed Missile', new_missile_list);
        }else{
            destroy_missile(live_missiles[i]);
        }
    }
    live_missiles = new_missile_list;
    update_loop();
},
 step)